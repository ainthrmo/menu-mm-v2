-- ==============================================================================
-- MIGRATION: 20261107_pdf_menu_studio_complete.sql
-- Description: Consolidated, safe, idempotent database & storage setup for
--              PDF Menu Studio Phase 1.
-- Target: Supabase Postgres & Storage
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DATABASE COLUMNS (restaurants table)
-- ------------------------------------------------------------------------------
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS menu_mode text NOT NULL DEFAULT 'digital',
  ADD COLUMN IF NOT EXISTS menu_pdf_path text NULL;

-- Idempotently establish CHECK constraints
DO $$
BEGIN
  -- 1a. Ensure menu_mode is strictly 'digital' or 'pdf'
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_menu_mode_check'
  ) THEN
    ALTER TABLE public.restaurants
      ADD CONSTRAINT restaurants_menu_mode_check CHECK (menu_mode IN ('digital', 'pdf'));
  END IF;

  -- 1b. Ensure menu_pdf_path follows the format: {uuid}/menu-{timestamp}.pdf
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_menu_pdf_path_check'
  ) THEN
    ALTER TABLE public.restaurants
      ADD CONSTRAINT restaurants_menu_pdf_path_check CHECK (
        menu_pdf_path IS NULL OR
        menu_pdf_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/menu-[0-9]+\.pdf$'
      );
  END IF;

  -- 1c. Ensure menu_mode = 'pdf' requires a non-null menu_pdf_path
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'restaurants_pdf_requires_path'
  ) THEN
    ALTER TABLE public.restaurants
      ADD CONSTRAINT restaurants_pdf_requires_path CHECK (
        NOT (menu_mode = 'pdf' AND menu_pdf_path IS NULL)
      );
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TRIGGER & FUNCTION: Protect direct column updates
-- ------------------------------------------------------------------------------
-- Prevents unauthorized users from tampering directly with menu_mode or menu_pdf_path
CREATE OR REPLACE FUNCTION public.block_menu_mode_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF (NEW.menu_mode IS DISTINCT FROM OLD.menu_mode OR
      NEW.menu_pdf_path IS DISTINCT FROM OLD.menu_pdf_path) AND
     NOT (
       current_user IN ('postgres', 'service_role', 'supabase_admin') OR
       public.is_admin_or_staff()
     ) THEN
    RAISE EXCEPTION 'Only admins or staff may modify menu_mode or menu_pdf_path';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_block_menu_mode_updates ON public.restaurants;
CREATE TRIGGER trg_block_menu_mode_updates
BEFORE UPDATE ON public.restaurants
FOR EACH ROW EXECUTE FUNCTION public.block_menu_mode_updates();

-- ------------------------------------------------------------------------------
-- 3. RPC: set_restaurant_pdf_menu
-- ------------------------------------------------------------------------------
-- Atomic function to set or revert PDF menu for a restaurant.
-- Expected signature: set_restaurant_pdf_menu(p_restaurant_id uuid, p_path text)
CREATE OR REPLACE FUNCTION public.set_restaurant_pdf_menu(
  p_restaurant_id uuid,
  p_path text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- 1. Authorization: Only platform admins or staff may manage PDF menus
  IF NOT (public.is_admin_or_staff()) THEN
    RAISE EXCEPTION 'Permission denied: administrative privileges required';
  END IF;

  -- 2. Validate input and update restaurant
  IF p_path IS NULL THEN
    -- Revert back to digital theme
    UPDATE public.restaurants
    SET menu_mode = 'digital',
        menu_pdf_path = NULL
    WHERE id = p_restaurant_id;
  ELSE
    -- Validate path strictly conforms to restaurant folder prefix
    IF NOT (p_path LIKE p_restaurant_id::text || '/menu-%') THEN
      RAISE EXCEPTION 'Invalid PDF path pattern: path must start with %/menu-', p_restaurant_id;
    END IF;

    -- Validate path regex format
    IF NOT (p_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/menu-[0-9]+\.pdf$') THEN
      RAISE EXCEPTION 'Invalid PDF filename format';
    END IF;

    -- Set mode to PDF
    UPDATE public.restaurants
    SET menu_mode = 'pdf',
        menu_pdf_path = p_path
    WHERE id = p_restaurant_id;
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant not found with id %', p_restaurant_id;
  END IF;
END;
$$;

-- Restrict RPC permissions: Authenticated callers only (function verifies admin/staff internally)
REVOKE ALL ON FUNCTION public.set_restaurant_pdf_menu(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_restaurant_pdf_menu(uuid, text) TO authenticated;

-- ------------------------------------------------------------------------------
-- 4. STORAGE BUCKET: menu-pdfs
-- ------------------------------------------------------------------------------
-- Create bucket with public = true for customer menu rendering.
-- Size limit: 5 MiB (5242880 bytes).
-- Allowed MIME types: application/pdf only.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-pdfs',
  'menu-pdfs',
  true,
  5242880,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 5. STORAGE RLS POLICIES (storage.objects)
-- ------------------------------------------------------------------------------

-- (a) SELECT: Public read access so customer menus can load the PDF
DROP POLICY IF EXISTS "Public read access for menu-pdfs" ON storage.objects;
CREATE POLICY "Public read access for menu-pdfs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-pdfs');

-- (b) INSERT: Authorized admin/staff can upload into the corresponding restaurant folder
DROP POLICY IF EXISTS "Admins can upload to menu-pdfs" ON storage.objects;
CREATE POLICY "Admins can upload to menu-pdfs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'menu-pdfs'
    AND public.is_admin_or_staff()
    AND (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  );

-- (c) UPDATE: Authorized admin/staff can replace objects in menu-pdfs
DROP POLICY IF EXISTS "Admins can update objects in menu-pdfs" ON storage.objects;
CREATE POLICY "Admins can update objects in menu-pdfs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'menu-pdfs'
    AND public.is_admin_or_staff()
  )
  WITH CHECK (
    bucket_id = 'menu-pdfs'
    AND public.is_admin_or_staff()
    AND (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  );

-- (d) DELETE: Authorized admin/staff can delete objects in menu-pdfs
DROP POLICY IF EXISTS "Admins can delete objects in menu-pdfs" ON storage.objects;
CREATE POLICY "Admins can delete objects in menu-pdfs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'menu-pdfs'
    AND public.is_admin_or_staff()
  );
