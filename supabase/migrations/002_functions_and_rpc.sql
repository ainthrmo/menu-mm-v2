-- 20261021_02_functions.sql
-- Admin RPC to set the PDF menu for a restaurant with flexible behavior

CREATE OR REPLACE FUNCTION public.set_restaurant_pdf_menu(p_restaurant_id uuid, p_path text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins or staff may call this function
  IF NOT (public.is_admin_or_staff()) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  IF p_path IS NULL THEN
    UPDATE public.restaurants
    SET menu_mode = 'digital',
        menu_pdf_path = NULL
    WHERE id = p_restaurant_id;
  ELSE
    -- Ensure path starts with restaurant_id and follows naming pattern
    IF NOT (p_path LIKE p_restaurant_id::text || '/menu-%') THEN
      RAISE EXCEPTION 'Invalid PDF path pattern';
    END IF;
    UPDATE public.restaurants
    SET menu_mode = 'pdf',
        menu_pdf_path = p_path
    WHERE id = p_restaurant_id;
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant not found';
  END IF;
END;
$$;

-- Revoke public execution and grant to authenticated users only
REVOKE ALL ON FUNCTION public.set_restaurant_pdf_menu(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_restaurant_pdf_menu(uuid, text) TO authenticated;

-- Admin RPC to set the PDF menu for a restaurant

CREATE OR REPLACE FUNCTION public.set_restaurant_pdf_menu(p_restaurant_id uuid, p_path text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins or staff may call this function
  IF NOT (public.is_admin_or_staff()) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE public.restaurants
  SET menu_mode = 'pdf',
      menu_pdf_path = p_path
  WHERE id = p_restaurant_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant not found';
  END IF;
END;
$$;

-- Revoke public execution and grant to authenticated users only
REVOKE ALL ON FUNCTION public.set_restaurant_pdf_menu(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_restaurant_pdf_menu(uuid, text) TO authenticated;
