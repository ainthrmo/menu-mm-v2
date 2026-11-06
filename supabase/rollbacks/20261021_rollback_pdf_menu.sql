-- 20261021_rollback_pdf_menu.sql
-- Rollback for the PDF menu feature (dated after latest migration)

-- Drop trigger and function
DROP TRIGGER IF EXISTS trg_block_menu_mode_updates ON public.restaurants;
DROP FUNCTION IF EXISTS public.block_menu_mode_updates();

-- Remove constraints and columns
ALTER TABLE public.restaurants
  DROP CONSTRAINT IF EXISTS restaurants_pdf_requires_path,
  DROP CONSTRAINT IF EXISTS restaurants_menu_pdf_path_check,
  DROP CONSTRAINT IF EXISTS restaurants_menu_mode_check,
  DROP COLUMN IF EXISTS menu_pdf_path,
  DROP COLUMN IF EXISTS menu_mode;

-- Drop RPC function
DROP FUNCTION IF EXISTS public.set_restaurant_pdf_menu(uuid, text);

-- Note: Bucket deletion must be performed manually via Supabase UI.
