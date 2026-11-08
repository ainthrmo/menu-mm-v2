-- ==============================================================================
-- MIGRATION: 20261108_set_store_profile_default_theme_text.sql
-- Description: Alter default customer theme to 'text' (Editorial) for new restaurants.
--              Preserves all existing restaurant theme selections without updating
--              any existing records in public.store_profile.
-- Target: Supabase Postgres
-- ==============================================================================

-- 1. Alter the column default on theme_type to 'text'
--    This ensures any subsequent rows created without an explicit theme_type
--    will default to 'text' (Editorial). Existing rows remain untouched.
ALTER TABLE public.store_profile
  ALTER COLUMN theme_type SET DEFAULT 'text';
