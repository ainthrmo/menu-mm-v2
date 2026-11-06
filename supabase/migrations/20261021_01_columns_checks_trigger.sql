-- 20261021_01_columns_checks_trigger.sql
-- Add menu_mode and menu_pdf_path columns, constraints, and a BEFORE UPDATE trigger

ALTER TABLE public.restaurants
  ADD COLUMN menu_mode text NOT NULL DEFAULT 'digital',
  ADD COLUMN menu_pdf_path text NULL;

-- CHECK constraints
ALTER TABLE public.restaurants
  ADD CONSTRAINT restaurants_menu_mode_check CHECK (menu_mode IN ('digital','pdf')),
  ADD CONSTRAINT restaurants_menu_pdf_path_check CHECK (
    menu_pdf_path IS NULL OR
    menu_pdf_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/menu-[0-9]+\.pdf$'
  ),
  ADD CONSTRAINT restaurants_pdf_requires_path CHECK (
    NOT (menu_mode = 'pdf' AND menu_pdf_path IS NULL)
  );

-- BEFORE UPDATE trigger to protect the two columns
CREATE OR REPLACE FUNCTION public.block_menu_mode_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF (NEW.menu_mode IS DISTINCT FROM OLD.menu_mode OR
      NEW.menu_pdf_path IS DISTINCT FROM OLD.menu_pdf_path) AND
     NOT (current_user IN ('postgres','service_role','supabase_admin') OR public.is_admin_or_staff()) THEN
    RAISE EXCEPTION 'Only admins or staff may modify menu_mode or menu_pdf_path';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_block_menu_mode_updates
BEFORE UPDATE ON public.restaurants
FOR EACH ROW EXECUTE FUNCTION public.block_menu_mode_updates();
