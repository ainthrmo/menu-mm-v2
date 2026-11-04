-- ==============================================================================
-- MIGRATION: 20261104_create_menu_images_policies.sql
-- Description: Establishes explicit row-level security policies on storage.objects
--              for the 'menu-images' bucket.
-- Ensures:
--   1. Public read access so customer menus can display dish photos without auth.
--   2. Strict tenant-scoped write (INSERT, UPDATE, DELETE) access based on the
--      first path segment (restaurant_id UUID) matching the caller's restaurant ownership
--      or platform admin/staff privileges.
--   3. Hardened SECURITY DEFINER helper function with fixed search_path = public.
-- ==============================================================================

-- 1. Ensure the 'menu-images' bucket exists with public read enabled (non-destructive)
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Helper function to check if an authenticated user can manage storage for a restaurant
-- Hardened with SECURITY DEFINER and search_path = public, pg_temp
CREATE OR REPLACE FUNCTION public.can_manage_restaurant_storage(p_folder text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_restaurant_id uuid;
BEGIN
  -- 1. Disallow null or empty folder names (rejects root uploads)
  IF p_folder IS NULL OR trim(p_folder) = '' THEN
    RETURN false;
  END IF;

  -- 2. Validate that folder is strictly a valid UUID format
  BEGIN
    v_restaurant_id := p_folder::uuid;
  EXCEPTION WHEN others THEN
    RETURN false;
  END;

  -- 3. Verify that the folder corresponds to an existing restaurant record in public.restaurants
  --    and that the caller is either:
  --    (a) a platform admin/staff, OR
  --    (b) the authenticated owner of that restaurant.
  RETURN EXISTS (
    SELECT 1
    FROM public.restaurants r
    WHERE r.id = v_restaurant_id
      AND (
        r.owner_id = auth.uid()
        OR public.is_admin_or_staff()
      )
  );
END;
$$;

-- Restrict function execution: revoke from public, grant to authenticated only
REVOKE ALL ON FUNCTION public.can_manage_restaurant_storage(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_manage_restaurant_storage(text) TO authenticated;

-- 3. Row-Level Security Policies on storage.objects for 'menu-images'

-- (a) SELECT: Public read access for customer menu rendering
DROP POLICY IF EXISTS "Public read access for menu-images" ON storage.objects;
CREATE POLICY "Public read access for menu-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

-- (b) INSERT: Authenticated users can only upload into their owned restaurant folder
DROP POLICY IF EXISTS "Owners can upload to own restaurant folder in menu-images" ON storage.objects;
CREATE POLICY "Owners can upload to own restaurant folder in menu-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'menu-images'
    AND public.can_manage_restaurant_storage((storage.foldername(name))[1])
  );

-- (c) UPDATE: Authenticated users can only update objects within their owned restaurant folder
-- Explicit USING and WITH CHECK to prevent moving files across tenant boundaries
DROP POLICY IF EXISTS "Owners can update objects in own restaurant folder in menu-images" ON storage.objects;
CREATE POLICY "Owners can update objects in own restaurant folder in menu-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'menu-images'
    AND public.can_manage_restaurant_storage((storage.foldername(name))[1])
  )
  WITH CHECK (
    bucket_id = 'menu-images'
    AND public.can_manage_restaurant_storage((storage.foldername(name))[1])
  );

-- (d) DELETE: Authenticated users can only delete objects within their owned restaurant folder
DROP POLICY IF EXISTS "Owners can delete objects in own restaurant folder in menu-images" ON storage.objects;
CREATE POLICY "Owners can delete objects in own restaurant folder in menu-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'menu-images'
    AND public.can_manage_restaurant_storage((storage.foldername(name))[1])
  );
