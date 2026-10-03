CREATE OR REPLACE FUNCTION public.create_organization_venue_for_current_user(p_name text)
 RETURNS TABLE(organization_id uuid, venue_id uuid, menu_id uuid, restaurant_id uuid, venue_slug text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_user_id uuid := (select auth.uid());
  v_restaurant_id uuid;
  v_org_id uuid;
  v_venue_id uuid;
  v_menu_id uuid;
  v_slug text;
begin
  if v_user_id is null then
    raise exception 'Unauthorized.' using errcode = '42501';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception 'Restaurant name is required.' using errcode = '22023';
  end if;

  select r.id into v_restaurant_id
  from public.restaurants r
  where r.owner_id = v_user_id
  limit 1;

  if v_restaurant_id is null then
    insert into public.restaurants(name, owner_id, status)
    values (trim(p_name), v_user_id, 'pending')
    returning id into v_restaurant_id;
  end if;

  select o.id into v_org_id
  from public.organizations o
  where o.legacy_restaurant_id = v_restaurant_id;

  if v_org_id is null then
    insert into public.organizations(name, status, legacy_restaurant_id)
    values (trim(p_name), 'active', v_restaurant_id)
    returning id into v_org_id;
  end if;

  insert into public.members(org_id, user_id, role)
  values (v_org_id, v_user_id, 'owner')
  on conflict (org_id, user_id) do update set role = 'owner';

  select v.id, v.slug into v_venue_id, v_slug
  from public.venues v
  where v.legacy_restaurant_id = v_restaurant_id;

  if v_venue_id is null then
    v_slug := public.generate_unique_venue_slug(trim(p_name), null);
    insert into public.venues(org_id, name, slug, currency, status, legacy_restaurant_id)
    values (v_org_id, trim(p_name), v_slug, 'MMK', 'active', v_restaurant_id)
    returning id, slug into v_venue_id, v_slug;
  end if;

  select m.id into v_menu_id
  from public.menus m
  where m.venue_id = v_venue_id and m.is_default = true
  limit 1;

  if v_menu_id is null then
    insert into public.menus(venue_id, name, slug, is_default, visible, sort_order)
    values (v_venue_id, 'Main Menu', 'main-menu', true, true, 0)
    returning id into v_menu_id;
  end if;

  return query
  select v_org_id, v_venue_id, v_menu_id, v_restaurant_id, v_slug;
end;
$function$


revoke execute on function public.create_organization_venue_for_current_user(text) from anon;
