-- =============================================================================
-- MOSSQR: Phase 1 – Additive Multi-Tenant Schema
-- Migration: 20261002_phase1_additive_schema.sql
-- =============================================================================
--
-- SAFE TO RUN: This migration is PURELY ADDITIVE.
--   - Wrapped entirely in a BEGIN ... COMMIT transaction block.
--   - No existing table is dropped, truncated, renamed, or altered.
--   - No existing column is removed or modified.
--   - No existing data is changed.
--   - All existing UUIDs, image URLs, QR codes, and routes remain valid.
--   - All existing auth, dashboard, and public menu behaviour is unchanged.
--
-- Strict dependency ordering:
--   1. Standalone helpers: generate_slug(), is_platform_admin()
--   2. platform_admins table + RLS
--   3. organizations table (table DDL & public/admin RLS)
--   4. members table + member helper functions (get_my_org_role, is_org_manager_or_owner)
--   5. members table RLS policies using get_my_org_role() (NO self-referential recursion)
--   6. organizations member/owner RLS policies using get_my_org_role()
--   7. venues table + generate_unique_venue_slug() + RLS
--   8. menus table + RLS
--   9. category_translations table + RLS
--  10. dishes table (nullable price) + RLS
--  11. dish_translations table + RLS
--  12. qr_codes table + RLS
--  13. staff_toggle_dish_availability() RPC
--  14. enforce_dish_limit() trigger on dishes
--  15. set_updated_at() trigger on all new tables
-- =============================================================================

BEGIN;

SET search_path = public;

-- =============================================================================
-- SECTION 0: STANDALONE HELPERS
-- =============================================================================

-- Generates a URL-safe ASCII slug from an English-language text string.
CREATE OR REPLACE FUNCTION public.generate_slug(p_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
STRICT
SET search_path = public
AS $$
DECLARE
  v_slug TEXT;
BEGIN
  v_slug := lower(trim(p_text));
  -- Replace whitespace and forward slashes with hyphens
  v_slug := regexp_replace(v_slug, '[\s/]+', '-', 'g');
  -- Strip anything that is not ASCII alphanumeric or a hyphen
  -- (removes Burmese Unicode, punctuation, etc.)
  v_slug := regexp_replace(v_slug, '[^a-z0-9\-]', '', 'g');
  -- Collapse consecutive hyphens
  v_slug := regexp_replace(v_slug, '-{2,}', '-', 'g');
  -- Trim leading/trailing hyphens
  v_slug := trim(both '-' from v_slug);
  -- Fallback when input produces an empty string
  IF v_slug IS NULL OR v_slug = '' THEN
    v_slug := 'venue';
  END IF;
  RETURN v_slug;
END;
$$;

COMMENT ON FUNCTION public.generate_slug(TEXT) IS
  'Converts an English text string into a URL-safe lowercase hyphenated slug. '
  'Non-ASCII characters (including Burmese) are stripped. IMMUTABLE and STRICT.';

GRANT EXECUTE ON FUNCTION public.generate_slug(TEXT) TO anon, authenticated;


-- =============================================================================
-- SECTION 1: PLATFORM_ADMINS TABLE & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.platform_admins (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    granted_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.platform_admins IS
  'Users with platform-wide administrative access. '
  'Separate from per-org member roles. '
  'Coexists with public.profiles during migration.';

CREATE INDEX IF NOT EXISTS idx_platform_admins_user_id
  ON public.platform_admins(user_id);

-- Helper: returns TRUE if the calling user is a platform admin.
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO anon, authenticated;

ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins can view platform_admins" ON public.platform_admins;
CREATE POLICY "Platform admins can view platform_admins"
  ON public.platform_admins FOR SELECT
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Platform admins can manage platform_admins" ON public.platform_admins;
CREATE POLICY "Platform admins can manage platform_admins"
  ON public.platform_admins FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());


-- =============================================================================
-- SECTION 2: ORGANIZATIONS TABLE (DDL & BASE RLS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 TEXT        NOT NULL,
    status               TEXT        NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'disabled', 'pending')),
    -- Bridge to legacy restaurants table; remains until full cutover.
    legacy_restaurant_id UUID        UNIQUE REFERENCES public.restaurants(id) ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.organizations IS
  'Top-level multi-tenant entity. '
  'During migration maps 1:1 to restaurants via legacy_restaurant_id. '
  'Supports multiple venues per org in future phases.';

COMMENT ON COLUMN public.organizations.legacy_restaurant_id IS
  'Foreign key to public.restaurants for backward compatibility during migration. '
  'Set to NULL once the restaurant is fully migrated to the new schema.';

CREATE INDEX IF NOT EXISTS idx_organizations_legacy_restaurant_id
  ON public.organizations(legacy_restaurant_id);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins: full access to organizations" ON public.organizations;
CREATE POLICY "Platform admins: full access to organizations"
  ON public.organizations FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "Active organizations visible to public" ON public.organizations;
CREATE POLICY "Active organizations visible to public"
  ON public.organizations FOR SELECT
  USING (status = 'active');


-- =============================================================================
-- SECTION 3: MEMBERS TABLE, SECURITY DEFINER HELPERS & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.members (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES auth.users(id)           ON DELETE CASCADE,
    role        TEXT        NOT NULL DEFAULT 'staff'
                CHECK (role IN ('owner', 'manager', 'staff')),
    invited_by  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_org_member UNIQUE (org_id, user_id)
);

COMMENT ON TABLE public.members IS
  'Organization membership. A user can belong to multiple orgs with different roles. '
  'Role owner = full control. Role manager = edit content. '
  'Role staff = availability toggle only (enforced at DB level via RPC, not direct UPDATE).';

CREATE INDEX IF NOT EXISTS idx_members_org_id    ON public.members(org_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id   ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_org_user  ON public.members(org_id, user_id);

-- Helper: returns the calling user's role in a given org, or NULL if not a member.
-- SECURITY DEFINER bypasses RLS on public.members, preventing infinite recursion!
CREATE OR REPLACE FUNCTION public.get_my_org_role(p_org_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.members
  WHERE org_id = p_org_id AND user_id = auth.uid()
  LIMIT 1;
$$;

-- Helper: returns TRUE if the calling user is owner or manager in a given org.
CREATE OR REPLACE FUNCTION public.is_org_manager_or_owner(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE org_id   = p_org_id
      AND user_id  = auth.uid()
      AND role    IN ('owner', 'manager')
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_my_org_role(UUID)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_manager_or_owner(UUID) TO authenticated;

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins: full access to members" ON public.members;
CREATE POLICY "Platform admins: full access to members"
  ON public.members FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Using get_my_org_role() eliminates recursion on public.members
DROP POLICY IF EXISTS "Org members can view membership of their own org" ON public.members;
CREATE POLICY "Org members can view membership of their own org"
  ON public.members FOR SELECT
  USING (
    public.get_my_org_role(members.org_id) IS NOT NULL
  );

DROP POLICY IF EXISTS "Org owners can manage members" ON public.members;
CREATE POLICY "Org owners can manage members"
  ON public.members FOR ALL
  USING (
    public.get_my_org_role(members.org_id) = 'owner'
  )
  WITH CHECK (
    public.get_my_org_role(members.org_id) = 'owner'
  );


-- =============================================================================
-- SECTION 4: ORGANIZATIONS POLICIES (MEMBER-DEPENDENT)
-- =============================================================================
-- Uses get_my_org_role() for clean non-recursive security checks.

DROP POLICY IF EXISTS "Org members can view their own org" ON public.organizations;
CREATE POLICY "Org members can view their own org"
  ON public.organizations FOR SELECT
  USING (
    public.get_my_org_role(organizations.id) IS NOT NULL
  );

DROP POLICY IF EXISTS "Org owners can update their org" ON public.organizations;
CREATE POLICY "Org owners can update their org"
  ON public.organizations FOR UPDATE
  USING (
    public.get_my_org_role(organizations.id) = 'owner'
  )
  WITH CHECK (
    public.get_my_org_role(organizations.id) = 'owner'
  );


-- =============================================================================
-- SECTION 5: VENUES TABLE, SLUG DE-DUPLICATION & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.venues (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id               UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name                 TEXT        NOT NULL,
    slug                 TEXT        NOT NULL UNIQUE,
    currency             TEXT        NOT NULL DEFAULT 'MMK',
    status               TEXT        NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'disabled', 'pending')),
    legacy_restaurant_id UUID        UNIQUE REFERENCES public.restaurants(id) ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.venues IS
  'A venue belongs to an organization. Public URL: /r/{slug}. '
  'Slug is set once on creation from English name and never auto-updated. '
  'During migration maps 1:1 to restaurants via legacy_restaurant_id.';

COMMENT ON COLUMN public.venues.slug IS
  'Stable unique URL slug. Set once from English name. '
  'Never modified after creation — QR codes and external links rely on it.';

COMMENT ON COLUMN public.venues.currency IS
  'ISO 4217 currency code for price display at this venue. '
  'Prices in dishes.price are stored as integer minor units relative to this currency.';

CREATE INDEX IF NOT EXISTS idx_venues_org_id              ON public.venues(org_id);
CREATE INDEX IF NOT EXISTS idx_venues_slug                ON public.venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_legacy_restaurant_id ON public.venues(legacy_restaurant_id);

-- Generates a unique venue slug by appending -2, -3, etc. on conflict.
-- Defined after public.venues table is created so query resolves cleanly.
CREATE OR REPLACE FUNCTION public.generate_unique_venue_slug(
  p_name       TEXT,
  p_exclude_id UUID DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_base TEXT;
  v_slug TEXT;
  v_n    INTEGER := 1;
  v_hit  BOOLEAN;
BEGIN
  v_base := public.generate_slug(p_name);
  v_slug := v_base;
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM public.venues
      WHERE slug = v_slug
        AND (p_exclude_id IS NULL OR id <> p_exclude_id)
    ) INTO v_hit;
    EXIT WHEN NOT v_hit;
    v_n    := v_n + 1;
    v_slug := v_base || '-' || v_n;
  END LOOP;
  RETURN v_slug;
END;
$$;

COMMENT ON FUNCTION public.generate_unique_venue_slug(TEXT, UUID) IS
  'Returns a unique slug for a venue by appending -2, -3, etc. on conflict. '
  'Pass p_exclude_id during updates to ignore the venue''s own existing slug.';

GRANT EXECUTE ON FUNCTION public.generate_unique_venue_slug(TEXT, UUID) TO authenticated;

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active venues" ON public.venues;
CREATE POLICY "Public can view active venues"
  ON public.venues FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Platform admins: full access to venues" ON public.venues;
CREATE POLICY "Platform admins: full access to venues"
  ON public.venues FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "Org managers and owners can manage venues" ON public.venues;
CREATE POLICY "Org managers and owners can manage venues"
  ON public.venues FOR ALL
  USING      (public.is_org_manager_or_owner(venues.org_id))
  WITH CHECK (public.is_org_manager_or_owner(venues.org_id));

DROP POLICY IF EXISTS "Org staff can view their venues" ON public.venues;
CREATE POLICY "Org staff can view their venues"
  ON public.venues FOR SELECT
  USING (
    public.get_my_org_role(venues.org_id) IS NOT NULL
  );


-- =============================================================================
-- SECTION 6: MENUS TABLE & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.menus (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id    UUID        NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL DEFAULT 'Main Menu',
    slug        TEXT        NOT NULL DEFAULT 'main-menu',
    is_default  BOOLEAN     NOT NULL DEFAULT TRUE,
    visible     BOOLEAN     NOT NULL DEFAULT TRUE,
    sort_order  INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_venue_menu_slug UNIQUE (venue_id, slug)
);

COMMENT ON TABLE public.menus IS
  'A menu belongs to a venue. Public URL: /r/{venue-slug}/{menu-slug}. '
  'Default menu: name="Main Menu", slug="main-menu", is_default=true. '
  'Burmese UI displays "ပင်မမီနူး" for "Main Menu".';

CREATE INDEX IF NOT EXISTS idx_menus_venue_id ON public.menus(venue_id);

ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible menus" ON public.menus;
CREATE POLICY "Public can view visible menus"
  ON public.menus FOR SELECT
  USING (visible = TRUE);

DROP POLICY IF EXISTS "Platform admins: full access to menus" ON public.menus;
CREATE POLICY "Platform admins: full access to menus"
  ON public.menus FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "Org managers and owners can manage menus" ON public.menus;
CREATE POLICY "Org managers and owners can manage menus"
  ON public.menus FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues v
      WHERE v.id = menus.venue_id
        AND public.is_org_manager_or_owner(v.org_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.venues v
      WHERE v.id = menus.venue_id
        AND public.is_org_manager_or_owner(v.org_id)
    )
  );

DROP POLICY IF EXISTS "Org staff can view menus in their venues" ON public.menus;
CREATE POLICY "Org staff can view menus in their venues"
  ON public.menus FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues v
      WHERE v.id = menus.venue_id
        AND public.get_my_org_role(v.org_id) IS NOT NULL
    )
  );


-- =============================================================================
-- SECTION 7: CATEGORY_TRANSLATIONS TABLE & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.category_translations (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id  UUID        NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    lang_code    TEXT        NOT NULL,  -- ISO 639-1: 'my', 'en', 'zh', etc.
    name         TEXT        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_category_lang UNIQUE (category_id, lang_code)
);

COMMENT ON TABLE public.category_translations IS
  'Translations for public.categories rows. '
  'lang_code=''my'' (Burmese) is required; lang_code=''en'' (English) is optional. '
  'Backfilled in Phase 2 from categories.name_mm and categories.name.';

CREATE INDEX IF NOT EXISTS idx_category_translations_category_id
  ON public.category_translations(category_id);
CREATE INDEX IF NOT EXISTS idx_category_translations_lang
  ON public.category_translations(lang_code);

ALTER TABLE public.category_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view category translations" ON public.category_translations;
CREATE POLICY "Public can view category translations"
  ON public.category_translations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Platform admins: full access to category translations" ON public.category_translations;
CREATE POLICY "Platform admins: full access to category translations"
  ON public.category_translations FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "Org managers and owners can manage category translations" ON public.category_translations;
CREATE POLICY "Org managers and owners can manage category translations"
  ON public.category_translations FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM   public.categories c
      JOIN   public.restaurants r ON r.id = c.restaurant_id
      JOIN   public.venues      v ON v.legacy_restaurant_id = r.id
      WHERE  c.id = category_translations.category_id
        AND  public.is_org_manager_or_owner(v.org_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM   public.categories c
      JOIN   public.restaurants r ON r.id = c.restaurant_id
      JOIN   public.venues      v ON v.legacy_restaurant_id = r.id
      WHERE  c.id = category_translations.category_id
        AND  public.is_org_manager_or_owner(v.org_id)
    )
  );


-- =============================================================================
-- SECTION 8: DISHES TABLE & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.dishes (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_id              UUID        NOT NULL REFERENCES public.menus(id)      ON DELETE CASCADE,
    category_id          UUID        REFERENCES  public.categories(id)         ON DELETE SET NULL,
    -- Price as integer minor units. Currency defined on venues.currency.
    -- Preserves NULL if price is unassigned.
    price                INTEGER     CHECK (price IS NULL OR price >= 0),
    visible              BOOLEAN     NOT NULL DEFAULT TRUE,
    available            BOOLEAN     NOT NULL DEFAULT TRUE,
    image_url            TEXT,
    is_popular           BOOLEAN     NOT NULL DEFAULT FALSE,
    is_spicy             BOOLEAN     NOT NULL DEFAULT FALSE,
    sort_order           INTEGER     NOT NULL DEFAULT 0,
    legacy_menu_item_id  UUID        UNIQUE REFERENCES public.menu_items(id)   ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dishes IS
  'Target schema dish entity. Parallel to menu_items during migration. '
  'Price = integer minor units (currency on venues.currency). '
  'visible and available are separate fields. '
  'Staff can ONLY toggle available via the staff_toggle_dish_availability RPC.';

COMMENT ON COLUMN public.dishes.price IS
  'Price in integer minor units. '
  'MMK: 4500 = 4,500 MMK. USD: 450 = $4.50. '
  'See venues.currency for the applicable currency.';

COMMENT ON COLUMN public.dishes.visible IS
  'Controls whether the dish appears in the public menu listing. '
  'Managers and owners can toggle this.';

COMMENT ON COLUMN public.dishes.available IS
  'Controls whether the dish is currently orderable. '
  'All org roles (including staff) can toggle this via the '
  'staff_toggle_dish_availability() SECURITY DEFINER RPC only. '
  'Staff have no direct UPDATE permission on this table.';

COMMENT ON COLUMN public.dishes.legacy_menu_item_id IS
  'Bridge to public.menu_items during migration. '
  'Set to NULL once the restaurant is fully on the new schema.';

CREATE INDEX IF NOT EXISTS idx_dishes_menu_id              ON public.dishes(menu_id);
CREATE INDEX IF NOT EXISTS idx_dishes_category_id          ON public.dishes(category_id);
CREATE INDEX IF NOT EXISTS idx_dishes_legacy_menu_item_id  ON public.dishes(legacy_menu_item_id);
CREATE INDEX IF NOT EXISTS idx_dishes_visible_available    ON public.dishes(visible, available);
CREATE INDEX IF NOT EXISTS idx_dishes_sort_order           ON public.dishes(menu_id, sort_order);

ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Public: only rows where BOTH visible=TRUE and available=TRUE
DROP POLICY IF EXISTS "Public can view visible and available dishes" ON public.dishes;
CREATE POLICY "Public can view visible and available dishes"
  ON public.dishes FOR SELECT
  USING (visible = TRUE AND available = TRUE);

-- Platform admins: unrestricted
DROP POLICY IF EXISTS "Platform admins: full access to dishes" ON public.dishes;
CREATE POLICY "Platform admins: full access to dishes"
  ON public.dishes FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Managers and owners: full CRUD
DROP POLICY IF EXISTS "Org managers and owners can manage dishes" ON public.dishes;
CREATE POLICY "Org managers and owners can manage dishes"
  ON public.dishes FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM   public.menus  mn
      JOIN   public.venues v ON v.id = mn.venue_id
      WHERE  mn.id = dishes.menu_id
        AND  public.is_org_manager_or_owner(v.org_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM   public.menus  mn
      JOIN   public.venues v ON v.id = mn.venue_id
      WHERE  mn.id = dishes.menu_id
        AND  public.is_org_manager_or_owner(v.org_id)
    )
  );

-- Staff: SELECT only — see all dishes (available and unavailable) for dashboard
DROP POLICY IF EXISTS "Org staff can view all dishes in their venues" ON public.dishes;
CREATE POLICY "Org staff can view all dishes in their venues"
  ON public.dishes FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM   public.menus  mn
      JOIN   public.venues v  ON v.id = mn.venue_id
      WHERE  mn.id = dishes.menu_id
        AND  public.get_my_org_role(v.org_id) IS NOT NULL
    )
  );


-- =============================================================================
-- SECTION 9: DISH_TRANSLATIONS TABLE & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.dish_translations (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id      UUID        NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
    lang_code    TEXT        NOT NULL,   -- 'my', 'en', 'zh', etc.
    name         TEXT        NOT NULL,
    description  TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_dish_lang UNIQUE (dish_id, lang_code)
);

COMMENT ON TABLE public.dish_translations IS
  'Translations for dishes. '
  'lang_code=''my'' (Burmese) is required; lang_code=''en'' (English) is optional. '
  'Backfilled in Phase 2 from menu_items.name_mm and menu_items.name.';

CREATE INDEX IF NOT EXISTS idx_dish_translations_dish_id
  ON public.dish_translations(dish_id);
CREATE INDEX IF NOT EXISTS idx_dish_translations_lang
  ON public.dish_translations(lang_code);

ALTER TABLE public.dish_translations ENABLE ROW LEVEL SECURITY;

-- Public: only translations for visible dishes
DROP POLICY IF EXISTS "Public can view dish translations for visible dishes" ON public.dish_translations;
CREATE POLICY "Public can view dish translations for visible dishes"
  ON public.dish_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dishes d
      WHERE d.id      = dish_translations.dish_id
        AND d.visible = TRUE
    )
  );

-- Platform admins: unrestricted
DROP POLICY IF EXISTS "Platform admins: full access to dish translations" ON public.dish_translations;
CREATE POLICY "Platform admins: full access to dish translations"
  ON public.dish_translations FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Managers and owners: full CRUD
DROP POLICY IF EXISTS "Org managers and owners can manage dish translations" ON public.dish_translations;
CREATE POLICY "Org managers and owners can manage dish translations"
  ON public.dish_translations FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM   public.dishes d
      JOIN   public.menus  mn ON mn.id = d.menu_id
      JOIN   public.venues v  ON v.id  = mn.venue_id
      WHERE  d.id = dish_translations.dish_id
        AND  public.is_org_manager_or_owner(v.org_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM   public.dishes d
      JOIN   public.menus  mn ON mn.id = d.menu_id
      JOIN   public.venues v  ON v.id  = mn.venue_id
      WHERE  d.id = dish_translations.dish_id
        AND  public.is_org_manager_or_owner(v.org_id)
    )
  );

-- Staff: SELECT on translations for their venue's dishes
DROP POLICY IF EXISTS "Org staff can view dish translations in their venues" ON public.dish_translations;
CREATE POLICY "Org staff can view dish translations in their venues"
  ON public.dish_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM   public.dishes  d
      JOIN   public.menus   mn ON mn.id = d.menu_id
      JOIN   public.venues  v  ON v.id  = mn.venue_id
      WHERE  d.id = dish_translations.dish_id
        AND  public.get_my_org_role(v.org_id) IS NOT NULL
    )
  );


-- =============================================================================
-- SECTION 10: QR_CODES TABLE & RLS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.qr_codes (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id             UUID        NOT NULL REFERENCES public.venues(id)       ON DELETE CASCADE,
    menu_id              UUID        REFERENCES  public.menus(id)               ON DELETE SET NULL,
    url_path             TEXT        NOT NULL,
    label                TEXT,
    is_legacy            BOOLEAN     NOT NULL DEFAULT FALSE,
    legacy_restaurant_id UUID        REFERENCES public.restaurants(id)          ON DELETE SET NULL,
    scan_count           BIGINT      NOT NULL DEFAULT 0,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.qr_codes IS
  'Tracks QR code records and their target URLs. '
  'is_legacy=TRUE rows preserve existing /menu?restaurantId={uuid} URLs. '
  'New rows use /r/{venue-slug} or /r/{venue-slug}/{menu-slug}. '
  'Backfilled in Phase 2 for all existing restaurants.';

COMMENT ON COLUMN public.qr_codes.url_path IS
  'Relative URL this QR code encodes. '
  'Legacy: /menu?restaurantId={uuid}. '
  'New: /r/{venue-slug} or /r/{venue-slug}/{menu-slug}.';

CREATE INDEX IF NOT EXISTS idx_qr_codes_venue_id             ON public.qr_codes(venue_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_legacy_restaurant_id ON public.qr_codes(legacy_restaurant_id);

ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins: full access to qr_codes" ON public.qr_codes;
CREATE POLICY "Platform admins: full access to qr_codes"
  ON public.qr_codes FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "Org managers and owners can manage qr_codes" ON public.qr_codes;
CREATE POLICY "Org managers and owners can manage qr_codes"
  ON public.qr_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.venues v
      WHERE v.id = qr_codes.venue_id
        AND public.is_org_manager_or_owner(v.org_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.venues v
      WHERE v.id = qr_codes.venue_id
        AND public.is_org_manager_or_owner(v.org_id)
    )
  );

DROP POLICY IF EXISTS "Org members can view their qr_codes" ON public.qr_codes;
CREATE POLICY "Org members can view their qr_codes"
  ON public.qr_codes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.venues v
      WHERE  v.id = qr_codes.venue_id
        AND  public.get_my_org_role(v.org_id) IS NOT NULL
    )
  );


-- =============================================================================
-- SECTION 11: STAFF AVAILABILITY TOGGLE RPC
-- =============================================================================

CREATE OR REPLACE FUNCTION public.staff_toggle_dish_availability(
    p_dish_id   UUID,
    p_available BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id   UUID;
  v_member   RECORD;
BEGIN
  -- 1. Resolve which org this dish belongs to
  SELECT v.org_id INTO v_org_id
  FROM   public.dishes  d
  JOIN   public.menus   mn ON mn.id = d.menu_id
  JOIN   public.venues  v  ON v.id  = mn.venue_id
  WHERE  d.id = p_dish_id;

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Dish not found or already deleted: %', p_dish_id
      USING ERRCODE = 'P0002';
  END IF;

  -- 2. Verify the caller is a member of this org (any role)
  SELECT * INTO v_member
  FROM   public.members
  WHERE  org_id  = v_org_id
    AND  user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Access denied: you are not a member of this organization.'
      USING ERRCODE = '42501';
  END IF;

  -- 3. Write ONLY the availability flag and timestamp — nothing else
  UPDATE public.dishes
  SET    available  = p_available,
         updated_at = NOW()
  WHERE  id = p_dish_id;

END;
$$;

GRANT EXECUTE ON FUNCTION public.staff_toggle_dish_availability(UUID, BOOLEAN) TO authenticated;

COMMENT ON FUNCTION public.staff_toggle_dish_availability(UUID, BOOLEAN) IS
  'Toggles dishes.available for org members (owner, manager, or staff). '
  'Staff have no direct UPDATE permission on dishes — this RPC is their only write path. '
  'Only the available column is written; price, name, and visibility are untouched. '
  'SECURITY DEFINER: runs as function owner, bypassing RLS on dishes.';


-- =============================================================================
-- SECTION 12: DISH LIMIT ENFORCEMENT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.enforce_dish_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_venue_id       UUID;
  v_legacy_rest_id UUID;
  v_max_items      INTEGER;
  v_current_count  INTEGER;
  v_plan_name      TEXT;
BEGIN
  -- Resolve venue from menu
  SELECT mn.venue_id INTO v_venue_id
  FROM   public.menus mn
  WHERE  mn.id = NEW.menu_id;

  -- Resolve legacy restaurant for subscription lookup
  SELECT v.legacy_restaurant_id INTO v_legacy_rest_id
  FROM   public.venues v
  WHERE  v.id = v_venue_id;

  -- Look up plan limits via legacy restaurant → subscription → plan
  IF v_legacy_rest_id IS NOT NULL THEN
    SELECT COALESCE(p.max_menu_items, 20),
           COALESCE(p.name, 'Free')
    INTO   v_max_items, v_plan_name
    FROM   public.subscriptions s
    JOIN   public.plans         p ON p.id = s.plan_id
    WHERE  s.restaurant_id = v_legacy_rest_id
    FOR UPDATE OF s;
  END IF;

  -- Default to Free plan limits if no subscription row found
  v_max_items := COALESCE(v_max_items, 20);
  v_plan_name := COALESCE(v_plan_name, 'Free');

  -- Count all dishes across all menus for this venue
  SELECT COUNT(*) INTO v_current_count
  FROM   public.dishes d
  JOIN   public.menus  mn ON mn.id = d.menu_id
  WHERE  mn.venue_id = v_venue_id;

  IF v_current_count >= v_max_items THEN
    RAISE EXCEPTION
      'Dish limit of % reached for % plan. Cannot add more dishes.',
      v_max_items, v_plan_name;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_dish_limit ON public.dishes;
CREATE TRIGGER trg_enforce_dish_limit
  BEFORE INSERT ON public.dishes
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_dish_limit();

COMMENT ON FUNCTION public.enforce_dish_limit() IS
  'Enforces per-venue dish count limits based on the active subscription plan. '
  'Resolves limits via venues.legacy_restaurant_id → subscriptions → plans during migration.';


-- =============================================================================
-- SECTION 13: UPDATED_AT AUTO-TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'organizations',
    'members',
    'venues',
    'menus',
    'category_translations',
    'dishes',
    'dish_translations',
    'qr_codes'
  ] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_set_updated_at ON public.%I;
       CREATE TRIGGER trg_set_updated_at
         BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

COMMIT;

-- =============================================================================
-- END OF PHASE 1 MIGRATION
-- =============================================================================
