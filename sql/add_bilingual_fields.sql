-- ==============================================================================
-- ADD BILINGUAL FIELDS AND SORT_ORDER TO MENU_ITEMS AND CATEGORIES
-- ==============================================================================

-- 1. Add name_mm and description_mm to menu_items
ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS name_mm TEXT;

ALTER TABLE public.menu_items 
ADD COLUMN IF NOT EXISTS description_mm TEXT;

-- 2. Add name_mm and sort_order to categories
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS name_mm TEXT;

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 3. Backfill existing single name/description as Burmese value (Requirement 4)
UPDATE public.menu_items 
SET name_mm = name 
WHERE name_mm IS NULL OR name_mm = '';

UPDATE public.menu_items 
SET description_mm = description 
WHERE (description_mm IS NULL OR description_mm = '') AND description IS NOT NULL;

UPDATE public.categories 
SET name_mm = name 
WHERE name_mm IS NULL OR name_mm = '';
