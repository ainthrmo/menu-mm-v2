-- 000_rollback.sql
-- Rollback for PDF menu feature

-- 1. Drop trigger and function
DROP TRIGGER IF EXISTS trg_block_menu_mode_updates ON public.restaurants;
DROP FUNCTION IF EXISTS public.block_menu_mode_updates();

-- 2. Remove constraints, columns
ALTER TABLE public.restaurants
  DROP CONSTRAINT IF EXISTS restaurants_pdf_requires_path,
  DROP CONSTRAINT IF EXISTS restaurants_menu_pdf_path_check,
  DROP CONSTRAINT IF EXISTS restaurants_menu_mode_check,
  DROP COLUMN IF EXISTS menu_pdf_path,
  DROP COLUMN IF EXISTS menu_mode;

-- 3. Drop RPC function
DROP FUNCTION IF EXISTS public.set_restaurant_pdf_menu(uuid, text);

-- 4. Optionally drop the bucket (cannot drop via SQL, must use Supabase UI).\n-- No automated drop here.
