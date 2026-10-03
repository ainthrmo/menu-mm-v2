-- =============================================================================
-- MOSSQR: Phase 2 – Data Backfill
-- Migration: 20261002_phase2_backfill.sql
-- =============================================================================
--
-- DEPENDS ON: 20261002_phase1_additive_schema.sql must be applied first.
--
-- SAFE TO RUN:
--   - Wrapped entirely in BEGIN ... COMMIT transaction block.
--     Any error or verification mismatch triggers ROLLBACK automatically,
--     preventing partial migration states.
--   - No existing table or row is modified or deleted.
--   - Intentionally excludes orphan legacy rows (e.g. 'Hacker Burger' with
--     restaurant_id IS NULL) from migrating into dishes, while keeping them
--     intact in legacy menu_items.
--   - Explicit pre-check logs and validates orphan legacy menu_items.
--   - Preserves NULL in menu_items.price (no silent coercion to 0).
--   - Sets dishes.is_spicy to FALSE (menu_items.is_spicy column does not exist).
--   - Pre-validates category mapping determinism before creating dishes.
--   - Enforces exact target verification counts:
--       * organizations = 3
--       * venues = 3
--       * source menu_items total = 14
--       * migratable menu_items = 13
--       * orphan legacy menu_items = 1
--       * migrated dishes = 13
--       * Burmese dish translations = 13
--       * Burmese category translations = 10
--       * legacy QR codes = 3
--       * subscriptions = 3
--       * scan_events = 102
--       * zero orphan/ambiguous category mappings among migratable items
--       * source tables intact and unchanged
-- =============================================================================

BEGIN;

SET search_path = public;

-- =============================================================================
-- STEP 0: SAFETY PRE-CHECK
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'organizations'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'venues'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'dishes'
  ) THEN
    RAISE EXCEPTION
      'Phase 1 tables missing! Run 20261002_phase1_additive_schema.sql first.';
  END IF;
END;
$$;


-- =============================================================================
-- STEP 1: SEED PLATFORM_ADMINS
-- =============================================================================
INSERT INTO public.platform_admins (user_id)
SELECT p.id
FROM   public.profiles p
WHERE  p.role = 'admin'
  AND  p.id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;


-- =============================================================================
-- STEP 2: ORGANIZATIONS (1:1 with restaurants)
-- =============================================================================
INSERT INTO public.organizations (name, status, legacy_restaurant_id)
SELECT
  r.name,
  r.status,
  r.id
FROM public.restaurants r
WHERE NOT EXISTS (
  SELECT 1 FROM public.organizations o
  WHERE  o.legacy_restaurant_id = r.id
)
ON CONFLICT DO NOTHING;


-- =============================================================================
-- STEP 3: MEMBERS (Org Owners)
-- =============================================================================
INSERT INTO public.members (org_id, user_id, role)
SELECT
  o.id,
  r.owner_id,
  'owner'
FROM   public.restaurants r
JOIN   public.organizations o ON o.legacy_restaurant_id = r.id
WHERE  r.owner_id IS NOT NULL
  AND  NOT EXISTS (
         SELECT 1 FROM public.members m
         WHERE  m.org_id  = o.id
           AND  m.user_id = r.owner_id
       )
ON CONFLICT (org_id, user_id) DO NOTHING;


-- =============================================================================
-- STEP 4: VENUES (Stable URL slugs from English names)
-- =============================================================================
DO $$
DECLARE
  r_rec    RECORD;
  v_org_id UUID;
  v_slug   TEXT;
BEGIN
  FOR r_rec IN
    SELECT r.id, r.name, r.status
    FROM   public.restaurants  r
    JOIN   public.organizations o ON o.legacy_restaurant_id = r.id
    WHERE  NOT EXISTS (
      SELECT 1 FROM public.venues v
      WHERE  v.legacy_restaurant_id = r.id
    )
    ORDER BY r.created_at
  LOOP
    SELECT o.id INTO v_org_id
    FROM   public.organizations o
    WHERE  o.legacy_restaurant_id = r_rec.id;

    IF v_org_id IS NULL THEN
      RAISE EXCEPTION 'Assertion failure: No organization found for restaurant %', r_rec.id;
    END IF;

    v_slug := public.generate_unique_venue_slug(r_rec.name);

    INSERT INTO public.venues (org_id, name, slug, status, currency, legacy_restaurant_id)
    VALUES (
      v_org_id,
      r_rec.name,
      v_slug,
      r_rec.status,
      'MMK',
      r_rec.id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;


-- =============================================================================
-- STEP 5: MENUS (Default "Main Menu" per venue)
-- =============================================================================
INSERT INTO public.menus (venue_id, name, slug, is_default, visible)
SELECT
  v.id,
  'Main Menu',
  'main-menu',
  TRUE,
  TRUE
FROM public.venues v
WHERE NOT EXISTS (
  SELECT 1 FROM public.menus mn
  WHERE  mn.venue_id = v.id
)
ON CONFLICT (venue_id, slug) DO NOTHING;


-- =============================================================================
-- STEP 6: CATEGORY_TRANSLATIONS (Burmese 'my' required, English 'en' optional)
-- =============================================================================
-- 6a. Burmese translations (lang='my')
INSERT INTO public.category_translations (category_id, lang_code, name)
SELECT
  c.id,
  'my',
  COALESCE(NULLIF(TRIM(c.name_mm), ''), TRIM(c.name))
FROM public.categories c
WHERE NOT EXISTS (
  SELECT 1 FROM public.category_translations ct
  WHERE  ct.category_id = c.id
    AND  ct.lang_code   = 'my'
)
ON CONFLICT (category_id, lang_code) DO NOTHING;

-- 6b. English translations (lang='en')
INSERT INTO public.category_translations (category_id, lang_code, name)
SELECT
  c.id,
  'en',
  TRIM(c.name)
FROM public.categories c
WHERE TRIM(c.name) <> '' 
  AND TRIM(c.name) IS DISTINCT FROM NULLIF(TRIM(c.name_mm), '')
  AND NOT EXISTS (
    SELECT 1 FROM public.category_translations ct
    WHERE  ct.category_id = c.id
      AND  ct.lang_code   = 'en'
  )
ON CONFLICT (category_id, lang_code) DO NOTHING;


-- =============================================================================
-- STEP 7: ORPHAN CHECK, CATEGORY PRE-VALIDATION & DISHES BACKFILL
-- =============================================================================
-- Requirement:
--   1. Explicitly detect, report, and preserve orphan menu_items (restaurant_id IS NULL).
--   2. Deterministic menu_items.category -> categories mapping for migratable items.
--   3. Only migrate menu_items WHERE restaurant_id IS NOT NULL.
--   4. Compatible with actual menu_items schema (no mi.is_spicy reference).

DO $$
DECLARE
  v_orphan_row           RECORD;
  v_orphan_count         INTEGER := 0;
  v_ambiguous_categories RECORD;
  v_unmatched_items      RECORD;
  v_ambiguous_count      INTEGER := 0;
  v_unmatched_count      INTEGER := 0;
BEGIN
  -- 1. Explicit pre-check & report for orphan legacy menu_items (e.g. Hacker Burger)
  FOR v_orphan_row IN
    SELECT id, name, created_at
    FROM public.menu_items
    WHERE restaurant_id IS NULL
  LOOP
    v_orphan_count := v_orphan_count + 1;
    RAISE NOTICE '[Step 7 Pre-check] Found legacy orphan menu_item (will NOT be migrated to dishes, preserved in menu_items): id=%, name="%", created_at=%',
      v_orphan_row.id,
      v_orphan_row.name,
      v_orphan_row.created_at;
  END LOOP;

  -- Ensure exact expected count of legacy orphan items
  IF v_orphan_count <> 1 THEN
    RAISE EXCEPTION 'Orphan pre-check failed: expected exactly 1 legacy orphan menu_item (e.g. Hacker Burger), found %',
      v_orphan_count;
  END IF;

  -- 2. Check for duplicate/ambiguous category names in the same restaurant
  FOR v_ambiguous_categories IN
    SELECT restaurant_id, LOWER(TRIM(name)) AS normalized_name, COUNT(*) AS match_count
    FROM public.categories
    GROUP BY restaurant_id, LOWER(TRIM(name))
    HAVING COUNT(*) > 1
  LOOP
    v_ambiguous_count := v_ambiguous_count + 1;
    RAISE WARNING 'Ambiguous category in categories table: restaurant_id=%, name=%, duplicates=%',
      v_ambiguous_categories.restaurant_id,
      v_ambiguous_categories.normalized_name,
      v_ambiguous_categories.match_count;
  END LOOP;

  IF v_ambiguous_count > 0 THEN
    RAISE EXCEPTION 'Category mapping is non-deterministic: found % duplicate category names within restaurants.',
      v_ambiguous_count;
  END IF;

  -- 3. Check for migratable menu_items (restaurant_id IS NOT NULL) that reference an unmapped category
  FOR v_unmatched_items IN
    SELECT mi.id, mi.name, mi.category, mi.restaurant_id
    FROM public.menu_items mi
    LEFT JOIN public.categories c
      ON  TRIM(LOWER(c.name)) = TRIM(LOWER(mi.category))
      AND c.restaurant_id     = mi.restaurant_id
    WHERE mi.restaurant_id IS NOT NULL
      AND mi.category IS NOT NULL
      AND TRIM(mi.category) <> ''
      AND c.id IS NULL
  LOOP
    v_unmatched_count := v_unmatched_count + 1;
    RAISE WARNING 'Unmatched category reference: menu_item id=%, item_name=%, category_text="%", restaurant_id=%',
      v_unmatched_items.id,
      v_unmatched_items.name,
      v_unmatched_items.category,
      v_unmatched_items.restaurant_id;
  END LOOP;

  IF v_unmatched_count > 0 THEN
    RAISE EXCEPTION 'Zero-orphan category rule violated: found % migratable menu_items with unmatched categories.',
      v_unmatched_count;
  END IF;
END;
$$;

-- Insert dishes ONLY for migratable menu_items (restaurant_id IS NOT NULL)
-- Preserves NULL price (no silent coercion to 0)
-- Sets is_spicy to FALSE (column not present in legacy menu_items table)
INSERT INTO public.dishes (
  menu_id,
  category_id,
  price,
  visible,
  available,
  image_url,
  is_popular,
  is_spicy,
  sort_order,
  legacy_menu_item_id
)
SELECT
  mn.id                                          AS menu_id,
  c.id                                           AS category_id,
  -- Deterministic price handling:
  -- NULL preserved as NULL.
  -- Numeric value rounded to integer minor units (4500 MMK -> 4500).
  CASE
    WHEN mi.price IS NULL THEN NULL
    ELSE ROUND(mi.price)::INTEGER
  END                                            AS price,
  TRUE                                           AS visible,
  COALESCE(mi.is_available, TRUE)                AS available,
  mi.image                                       AS image_url,
  COALESCE(mi.is_popular, FALSE)                 AS is_popular,
  FALSE                                          AS is_spicy,
  ROW_NUMBER() OVER (
    PARTITION BY mi.restaurant_id
    ORDER BY mi.created_at
  )::INTEGER                                     AS sort_order,
  mi.id                                          AS legacy_menu_item_id
FROM  public.menu_items mi
JOIN  public.venues v
  ON  v.legacy_restaurant_id = mi.restaurant_id
JOIN  public.menus mn
  ON  mn.venue_id   = v.id
  AND mn.is_default = TRUE
LEFT JOIN public.categories c
  ON  TRIM(LOWER(c.name)) = TRIM(LOWER(mi.category))
  AND c.restaurant_id     = mi.restaurant_id
WHERE mi.restaurant_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.dishes d
    WHERE  d.legacy_menu_item_id = mi.id
  )
ON CONFLICT DO NOTHING;


-- =============================================================================
-- STEP 8: DISH_TRANSLATIONS
-- =============================================================================
-- 8a. Burmese dish translations (lang='my', required)
INSERT INTO public.dish_translations (dish_id, lang_code, name, description)
SELECT
  d.id,
  'my',
  COALESCE(NULLIF(TRIM(mi.name_mm), ''), TRIM(mi.name)),
  NULLIF(TRIM(COALESCE(mi.description_mm, '')), '')
FROM  public.dishes     d
JOIN  public.menu_items mi ON mi.id = d.legacy_menu_item_id
WHERE d.legacy_menu_item_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.dish_translations dt
    WHERE  dt.dish_id   = d.id
      AND  dt.lang_code = 'my'
  )
ON CONFLICT (dish_id, lang_code) DO NOTHING;

-- 8b. English dish translations (lang='en', optional)
INSERT INTO public.dish_translations (dish_id, lang_code, name, description)
SELECT
  d.id,
  'en',
  TRIM(mi.name),
  NULLIF(TRIM(COALESCE(mi.description, '')), '')
FROM  public.dishes     d
JOIN  public.menu_items mi ON mi.id = d.legacy_menu_item_id
WHERE d.legacy_menu_item_id IS NOT NULL
  AND (
    TRIM(mi.name) IS DISTINCT FROM NULLIF(TRIM(mi.name_mm), '')
    OR (
      NULLIF(TRIM(mi.description), '') IS NOT NULL
      AND NULLIF(TRIM(mi.description), '') IS DISTINCT FROM NULLIF(TRIM(mi.description_mm), '')
    )
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.dish_translations dt
    WHERE  dt.dish_id   = d.id
      AND  dt.lang_code = 'en'
  )
ON CONFLICT (dish_id, lang_code) DO NOTHING;


-- =============================================================================
-- STEP 9: QR_CODES (Preserve existing UUID-based URLs)
-- =============================================================================
INSERT INTO public.qr_codes (
  venue_id,
  menu_id,
  url_path,
  label,
  is_legacy,
  legacy_restaurant_id,
  scan_count
)
SELECT
  v.id,
  mn.id,
  '/menu?restaurantId=' || r.id::TEXT,
  'Main QR Code',
  TRUE,
  r.id,
  COALESCE(r.scan_count, 0)
FROM  public.restaurants r
JOIN  public.venues      v  ON v.legacy_restaurant_id = r.id
JOIN  public.menus       mn ON mn.venue_id = v.id AND mn.is_default = TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.qr_codes qr
  WHERE  qr.legacy_restaurant_id = r.id
)
ON CONFLICT DO NOTHING;


-- =============================================================================
-- STEP 10: STRICT VERIFICATION REPORT & ASSERTIONS
-- =============================================================================
DO $$
DECLARE
  -- Source baseline counts
  v_restaurants             INTEGER;
  v_categories              INTEGER;
  v_menu_items_total        INTEGER;
  v_menu_items_migratable   INTEGER;
  v_menu_items_orphan       INTEGER;
  v_subscriptions           INTEGER;
  v_scan_events             INTEGER;

  -- New table counts
  v_organizations           INTEGER;
  v_venues                  INTEGER;
  v_dishes                  INTEGER;
  v_cat_trans_my            INTEGER;
  v_dish_trans_my           INTEGER;
  v_legacy_qr_codes         INTEGER;

  -- Integrity counts
  v_orphan_venues           INTEGER;
  v_orphan_dishes_menu      INTEGER;
  v_orphan_dishes_cat       INTEGER;
  v_dishes_price_neg        INTEGER;
  v_null_prices             INTEGER;
BEGIN
  -- 1. Read source counts
  SELECT COUNT(*) INTO v_restaurants             FROM public.restaurants;
  SELECT COUNT(*) INTO v_categories              FROM public.categories;
  SELECT COUNT(*) INTO v_menu_items_total        FROM public.menu_items;
  SELECT COUNT(*) INTO v_menu_items_migratable   FROM public.menu_items WHERE restaurant_id IS NOT NULL;
  SELECT COUNT(*) INTO v_menu_items_orphan       FROM public.menu_items WHERE restaurant_id IS NULL;
  SELECT COUNT(*) INTO v_subscriptions           FROM public.subscriptions;
  SELECT COUNT(*) INTO v_scan_events             FROM public.scan_events;

  -- 2. Read new table counts
  SELECT COUNT(*) INTO v_organizations           FROM public.organizations;
  SELECT COUNT(*) INTO v_venues                  FROM public.venues;
  SELECT COUNT(*) INTO v_dishes                  FROM public.dishes;
  SELECT COUNT(*) INTO v_cat_trans_my            FROM public.category_translations WHERE lang_code = 'my';
  SELECT COUNT(*) INTO v_dish_trans_my           FROM public.dish_translations WHERE lang_code = 'my';
  SELECT COUNT(*) INTO v_legacy_qr_codes         FROM public.qr_codes WHERE is_legacy = TRUE;

  -- 3. Integrity checks
  SELECT COUNT(*) INTO v_orphan_venues           FROM public.venues WHERE org_id IS NULL;
  SELECT COUNT(*) INTO v_orphan_dishes_menu      FROM public.dishes WHERE menu_id IS NULL;
  SELECT COUNT(*) INTO v_orphan_dishes_cat       FROM public.dishes WHERE category_id IS NULL AND legacy_menu_item_id IS NOT NULL;
  SELECT COUNT(*) INTO v_dishes_price_neg        FROM public.dishes WHERE price < 0;
  SELECT COUNT(*) INTO v_null_prices             FROM public.dishes WHERE price IS NULL;

  RAISE NOTICE '=============================================================';
  RAISE NOTICE 'Phase 2 Backfill Strict Verification';
  RAISE NOTICE '=============================================================';
  RAISE NOTICE 'Source restaurants:             % (expected 3)', v_restaurants;
  RAISE NOTICE 'Source categories:              % (expected 10)', v_categories;
  RAISE NOTICE 'Source menu_items total:        % (expected 14)', v_menu_items_total;
  RAISE NOTICE 'Source menu_items migratable:   % (expected 13)', v_menu_items_migratable;
  RAISE NOTICE 'Source menu_items orphan:       % (expected 1)', v_menu_items_orphan;
  RAISE NOTICE 'Source subscriptions:           % (expected 3)', v_subscriptions;
  RAISE NOTICE 'Source scan_events:             % (expected 102)', v_scan_events;
  RAISE NOTICE '-------------------------------------------------------------';
  RAISE NOTICE 'New organizations:              % (expected 3)', v_organizations;
  RAISE NOTICE 'New venues:                     % (expected 3)', v_venues;
  RAISE NOTICE 'New dishes:                     % (expected 13)', v_dishes;
  RAISE NOTICE 'Burmese dish translations:      % (expected 13)', v_dish_trans_my;
  RAISE NOTICE 'Burmese category translations:  % (expected 10)', v_cat_trans_my;
  RAISE NOTICE 'Legacy QR codes:                % (expected 3)', v_legacy_qr_codes;
  RAISE NOTICE '-------------------------------------------------------------';
  RAISE NOTICE 'Orphan venues (NULL org_id):    %', v_orphan_venues;
  RAISE NOTICE 'Orphan dishes (NULL menu_id):   %', v_orphan_dishes_menu;
  RAISE NOTICE 'Orphan dishes (unmapped cat):   %', v_orphan_dishes_cat;
  RAISE NOTICE 'Dishes with NULL price:         %', v_null_prices;
  RAISE NOTICE 'Dishes with price < 0:          %', v_dishes_price_neg;
  RAISE NOTICE '=============================================================';

  -- Strict Production Assertions (Fail & Rollback if any assertion fails)
  IF v_restaurants <> 3 THEN
    RAISE EXCEPTION 'Verification failed: source restaurants count is %, expected 3', v_restaurants;
  END IF;

  IF v_categories <> 10 THEN
    RAISE EXCEPTION 'Verification failed: source categories count is %, expected 10', v_categories;
  END IF;

  IF v_menu_items_total <> 14 THEN
    RAISE EXCEPTION 'Verification failed: source menu_items total is %, expected 14', v_menu_items_total;
  END IF;

  IF v_menu_items_migratable <> 13 THEN
    RAISE EXCEPTION 'Verification failed: migratable menu_items count is %, expected 13', v_menu_items_migratable;
  END IF;

  IF v_menu_items_orphan <> 1 THEN
    RAISE EXCEPTION 'Verification failed: orphan menu_items count is %, expected 1', v_menu_items_orphan;
  END IF;

  IF v_subscriptions <> 3 THEN
    RAISE EXCEPTION 'Verification failed: subscriptions count is %, expected 3', v_subscriptions;
  END IF;

  IF v_scan_events <> 102 THEN
    RAISE EXCEPTION 'Verification failed: scan_events count is %, expected 102', v_scan_events;
  END IF;

  IF v_organizations <> 3 THEN
    RAISE EXCEPTION 'Verification failed: organizations count is %, expected 3', v_organizations;
  END IF;

  IF v_venues <> 3 THEN
    RAISE EXCEPTION 'Verification failed: venues count is %, expected 3', v_venues;
  END IF;

  IF v_dishes <> 13 THEN
    RAISE EXCEPTION 'Verification failed: dishes count is %, expected 13', v_dishes;
  END IF;

  IF v_dish_trans_my <> 13 THEN
    RAISE EXCEPTION 'Verification failed: Burmese dish translations count is %, expected 13', v_dish_trans_my;
  END IF;

  IF v_cat_trans_my <> 10 THEN
    RAISE EXCEPTION 'Verification failed: Burmese category translations count is %, expected 10', v_cat_trans_my;
  END IF;

  IF v_legacy_qr_codes <> 3 THEN
    RAISE EXCEPTION 'Verification failed: legacy QR codes count is %, expected 3', v_legacy_qr_codes;
  END IF;

  IF v_orphan_venues > 0 THEN
    RAISE EXCEPTION 'Integrity failure: % venues have NULL org_id', v_orphan_venues;
  END IF;

  IF v_orphan_dishes_menu > 0 THEN
    RAISE EXCEPTION 'Integrity failure: % dishes have NULL menu_id', v_orphan_dishes_menu;
  END IF;

  IF v_orphan_dishes_cat > 0 THEN
    RAISE EXCEPTION 'Integrity failure: % dishes have unmapped category_id', v_orphan_dishes_cat;
  END IF;

  IF v_dishes_price_neg > 0 THEN
    RAISE EXCEPTION 'Integrity failure: % dishes have negative price', v_dishes_price_neg;
  END IF;

  RAISE NOTICE 'ALL STRICT VERIFICATION CHECKS PASSED SUCCESSFULLY.';
END;
$$;

COMMIT;

-- =============================================================================
-- END OF PHASE 2 MIGRATION
-- =============================================================================
