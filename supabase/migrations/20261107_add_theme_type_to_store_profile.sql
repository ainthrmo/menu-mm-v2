-- ==============================================================================
-- MIGRATION: 20261107_add_theme_type_to_store_profile.sql
-- Description: Add customer-facing digital menu theme preference ('moss' | 'text')
--              to public.store_profile with safe default and constraint.
-- Target: Supabase Postgres
-- NOTE: This migration was previously applied to the live database.
-- ==============================================================================

-- 1. Add theme_type column to store_profile if it does not already exist
ALTER TABLE public.store_profile
  ADD COLUMN IF NOT EXISTS theme_type text NOT NULL DEFAULT 'moss';

-- 2. Idempotently add CHECK constraint to ensure only valid themes ('moss', 'text')
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'store_profile_theme_type_check'
  ) THEN
    ALTER TABLE public.store_profile
      ADD CONSTRAINT store_profile_theme_type_check CHECK (theme_type IN ('moss', 'text'));
  END IF;
END $$;
