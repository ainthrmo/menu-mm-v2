-- =============================================================================
-- MOSSQR V1.5 – Phase 1: Restaurant Tables & Service Requests
-- Migration: 20261004_v15_tables_and_service_requests.sql
-- =============================================================================
--
-- SAFE TO RUN: This migration is PURELY ADDITIVE.
--   - No existing table is dropped, truncated, renamed, or altered.
--   - No existing column is removed or modified.
--   - No existing data is changed.
--   - All existing QR codes, menu URLs, and routes remain valid.
--   - All existing auth, dashboard, and public menu behaviour is unchanged.
--
-- Creates:
--   1. restaurant_tables – physical/logical tables within a restaurant
--   2. service_requests  – customer-initiated service calls (waiter/bill)
--   3. validate_table_belongs_to_restaurant() – server-side FK integrity RPC
--   4. RLS policies for both tables
--   5. Supabase Realtime publication for service_requests
--   6. Updated_at triggers for both tables
-- =============================================================================

BEGIN;

SET search_path = public;

-- =============================================================================
-- SECTION 1: RESTAURANT_TABLES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID        NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number    TEXT        NOT NULL,
    label           TEXT,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    qr_token        TEXT        UNIQUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_restaurant_table_number UNIQUE (restaurant_id, table_number)
);

COMMENT ON TABLE public.restaurant_tables IS
  'Physical or logical tables within a restaurant. '
  'Each table has a unique number per restaurant and an optional QR token for identification.';

COMMENT ON COLUMN public.restaurant_tables.table_number IS
  'Human-readable table identifier (e.g. "1", "A1", "Patio-3"). '
  'Must be unique within a restaurant.';

COMMENT ON COLUMN public.restaurant_tables.label IS
  'Optional friendly label (e.g. "Window Seat", "VIP Room 1").';

COMMENT ON COLUMN public.restaurant_tables.qr_token IS
  'Globally unique token embedded in QR codes to identify this table. '
  'Used in URL: /menu?restaurantId={uuid}&table={qr_token}';

COMMENT ON COLUMN public.restaurant_tables.is_active IS
  'Soft-delete / disable flag. Inactive tables cannot receive new service requests.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_restaurant_id
  ON public.restaurant_tables(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_restaurant_tables_qr_token
  ON public.restaurant_tables(qr_token)
  WHERE qr_token IS NOT NULL;

-- =============================================================================
-- SECTION 2: RESTAURANT_TABLES RLS POLICIES
-- =============================================================================

ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Platform admins: full access
DROP POLICY IF EXISTS "Platform admins: full access to restaurant_tables" ON public.restaurant_tables;
CREATE POLICY "Platform admins: full access to restaurant_tables"
  ON public.restaurant_tables FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Restaurant owners: full CRUD on their own tables
DROP POLICY IF EXISTS "Owners can manage their restaurant_tables" ON public.restaurant_tables;
CREATE POLICY "Owners can manage their restaurant_tables"
  ON public.restaurant_tables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_tables.restaurant_id
        AND r.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_tables.restaurant_id
        AND r.owner_id = (SELECT auth.uid())
    )
  );

-- Org managers/owners (new schema path): full CRUD
DROP POLICY IF EXISTS "Org managers can manage restaurant_tables" ON public.restaurant_tables;
CREATE POLICY "Org managers can manage restaurant_tables"
  ON public.restaurant_tables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.legacy_restaurant_id = restaurant_tables.restaurant_id
        AND public.is_org_manager_or_owner(o.id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.legacy_restaurant_id = restaurant_tables.restaurant_id
        AND public.is_org_manager_or_owner(o.id)
    )
  );

-- Anon/public: can view active tables (needed for customer menu table context)
DROP POLICY IF EXISTS "Public can view active restaurant_tables" ON public.restaurant_tables;
CREATE POLICY "Public can view active restaurant_tables"
  ON public.restaurant_tables FOR SELECT
  USING (is_active = TRUE);

-- =============================================================================
-- SECTION 3: SERVICE_REQUESTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.service_requests (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID        NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id        UUID        NOT NULL REFERENCES public.restaurant_tables(id) ON DELETE CASCADE,
    request_type    TEXT        NOT NULL CHECK (request_type IN ('call_waiter', 'request_bill')),
    status          TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'completed', 'cancelled')),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.service_requests IS
  'Customer-initiated service requests (call waiter, request bill). '
  'Each request is tied to a specific restaurant and table. '
  'Duplicate-pending protection prevents multiple active requests of the same type per table.';

COMMENT ON COLUMN public.service_requests.request_type IS
  'Type of service requested: "call_waiter" or "request_bill".';

COMMENT ON COLUMN public.service_requests.status IS
  'Current status: "pending" (active), "completed" (handled), or "cancelled" (dismissed).';

COMMENT ON COLUMN public.service_requests.completed_at IS
  'Timestamp when the request was marked as completed or cancelled. NULL while pending.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_requests_restaurant_id
  ON public.service_requests(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_table_id
  ON public.service_requests(table_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_status
  ON public.service_requests(status)
  WHERE status = 'pending';

-- Duplicate-pending protection: only one pending request per type per table
CREATE UNIQUE INDEX IF NOT EXISTS uq_service_requests_pending_per_table_type
  ON public.service_requests(restaurant_id, table_id, request_type)
  WHERE status = 'pending';

-- =============================================================================
-- SECTION 4: SERVICE_REQUESTS RLS POLICIES
-- =============================================================================

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Platform admins: full access
DROP POLICY IF EXISTS "Platform admins: full access to service_requests" ON public.service_requests;
CREATE POLICY "Platform admins: full access to service_requests"
  ON public.service_requests FOR ALL
  USING      (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Restaurant owners: full access to their requests
DROP POLICY IF EXISTS "Owners can manage their service_requests" ON public.service_requests;
CREATE POLICY "Owners can manage their service_requests"
  ON public.service_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = service_requests.restaurant_id
        AND r.owner_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = service_requests.restaurant_id
        AND r.owner_id = (SELECT auth.uid())
    )
  );

-- Org managers/owners (new schema path): full access
DROP POLICY IF EXISTS "Org managers can manage service_requests" ON public.service_requests;
CREATE POLICY "Org managers can manage service_requests"
  ON public.service_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.legacy_restaurant_id = service_requests.restaurant_id
        AND public.is_org_manager_or_owner(o.id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.legacy_restaurant_id = service_requests.restaurant_id
        AND public.is_org_manager_or_owner(o.id)
    )
  );

-- Anon/public: can INSERT service requests (customers create requests)
-- Validated server-side via validate_table_belongs_to_restaurant()
DROP POLICY IF EXISTS "Anyone can create service_requests" ON public.service_requests;
CREATE POLICY "Anyone can create service_requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (
    -- Ensure the table belongs to the restaurant and is active
    EXISTS (
      SELECT 1 FROM public.restaurant_tables rt
      WHERE rt.id = service_requests.table_id
        AND rt.restaurant_id = service_requests.restaurant_id
        AND rt.is_active = TRUE
    )
  );

-- NOTE: No anonymous SELECT policy. Customers cannot read back service requests.
-- UI provides optimistic feedback after INSERT. Only owners/admins/org managers
-- can view service requests (via their FOR ALL policies above).
DROP POLICY IF EXISTS "Anyone can view pending service_requests" ON public.service_requests;


-- =============================================================================
-- SECTION 5: SERVER-SIDE VALIDATION RPC
-- =============================================================================

-- Validates that a table belongs to a restaurant and is active.
-- Called before creating service requests from the client.
CREATE OR REPLACE FUNCTION public.validate_table_belongs_to_restaurant(
    p_restaurant_id UUID,
    p_table_id      UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.restaurant_tables
    WHERE id = p_table_id
      AND restaurant_id = p_restaurant_id
      AND is_active = TRUE
  );
END;
$$;

COMMENT ON FUNCTION public.validate_table_belongs_to_restaurant(UUID, UUID) IS
  'Server-side validation: confirms that a table belongs to the specified restaurant '
  'and is currently active. Used before creating service requests.';

-- Allow anon to call this validation function (needed for customer menu)
GRANT EXECUTE ON FUNCTION public.validate_table_belongs_to_restaurant(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_table_belongs_to_restaurant(UUID, UUID) TO authenticated;


-- =============================================================================
-- SECTION 6: SUPABASE REALTIME FOR SERVICE_REQUESTS
-- =============================================================================

-- Enable Realtime publication for service_requests
-- Restaurant owners will subscribe to changes on this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;


-- =============================================================================
-- SECTION 7: UPDATED_AT TRIGGERS
-- =============================================================================

-- Reuse the existing set_updated_at() function from Phase 1
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'restaurant_tables',
    'service_requests'
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


-- =============================================================================
-- SECTION 8: AUTO-SET completed_at ON STATUS CHANGE
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_service_request_completed_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- When status changes to 'completed' or 'cancelled', set completed_at
  IF NEW.status IN ('completed', 'cancelled') AND OLD.status = 'pending' THEN
    NEW.completed_at = NOW();
  END IF;

  -- If status changes back to 'pending' (unlikely but defensive), clear completed_at
  IF NEW.status = 'pending' AND OLD.status != 'pending' THEN
    NEW.completed_at = NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_completed_at ON public.service_requests;
CREATE TRIGGER trg_set_completed_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_service_request_completed_at();

COMMENT ON FUNCTION public.set_service_request_completed_at() IS
  'Automatically sets completed_at when a service request transitions to completed/cancelled, '
  'and clears it if the request returns to pending.';


COMMIT;

-- =============================================================================
-- END OF V1.5 PHASE 1 MIGRATION
-- =============================================================================
