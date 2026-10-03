CREATE OR REPLACE FUNCTION public.assert_restaurant_write_access(p_restaurant_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_org_id uuid;
begin
  select o.id into v_org_id
  from public.organizations o
  where o.legacy_restaurant_id = p_restaurant_id
    and (
      exists (
        select 1 from public.members m
        where m.org_id = o.id
          and m.user_id = (select auth.uid())
          and m.role in ('owner','manager')
      )
      or exists (
        select 1 from public.restaurants r
        where r.id = p_restaurant_id
          and r.owner_id = (select auth.uid())
      )
    );

  if v_org_id is null then
    raise exception 'Access denied for restaurant.' using errcode = '42501';
  end if;

  return v_org_id;
end;
$function$


CREATE OR REPLACE FUNCTION public.create_dish_legacy_bridge(p_restaurant_id uuid, p_category_id uuid, p_category_name text, p_name_en text, p_name_mm text, p_description_en text, p_description_mm text, p_price numeric, p_image_url text, p_is_popular boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_org_id uuid;
  v_menu_id uuid;
  v_legacy_id uuid;
  v_dish_id uuid;
  v_currency text;
begin
  v_org_id := public.assert_restaurant_write_access(p_restaurant_id);

  select v.id, v.currency into v_menu_id, v_currency
  from public.venues v
  join public.menus m on m.venue_id = v.id
  where v.legacy_restaurant_id = p_restaurant_id
    and m.is_default = true
    and m.visible = true
  limit 1;

  if v_menu_id is null then
    raise exception 'Default menu not found for restaurant.' using errcode = 'P0002';
  end if;

  if p_category_id is not null then
    if not exists (
      select 1 from public.categories c
      where c.id = p_category_id and c.restaurant_id = p_restaurant_id
    ) then
      raise exception 'Category does not belong to restaurant.' using errcode = '42501';
    end if;
  end if;

  insert into public.menu_items (
    restaurant_id, category, name, name_mm, price,
    description, description_mm, image, is_available, is_popular
  )
  values (
    p_restaurant_id,
    coalesce(nullif(trim(p_category_name), ''), 'Uncategorized'),
    coalesce(nullif(trim(p_name_en), ''), nullif(trim(p_name_mm), '')),
    nullif(trim(p_name_mm), ''),
    p_price,
    nullif(trim(p_description_en), ''),
    nullif(trim(p_description_mm), ''),
    nullif(trim(p_image_url), ''),
    true,
    coalesce(p_is_popular, false)
  )
  returning id into v_legacy_id;

  insert into public.dishes (
    menu_id, category_id, price, visible, available,
    image_url, is_popular, legacy_menu_item_id
  )
  values (
    v_menu_id,
    p_category_id,
    case when upper(v_currency) = 'MMK' then round(p_price)::integer else round(p_price * 100)::integer end,
    true,
    true,
    nullif(trim(p_image_url), ''),
    coalesce(p_is_popular, false),
    v_legacy_id
  )
  returning id into v_dish_id;

  insert into public.dish_translations (dish_id, lang_code, name, description)
  select v_dish_id, 'my', trim(p_name_mm), nullif(trim(p_description_mm), '')
  where nullif(trim(p_name_mm), '') is not null
  on conflict (dish_id, lang_code) do update
    set name = excluded.name,
        description = excluded.description,
        updated_at = now();

  insert into public.dish_translations (dish_id, lang_code, name, description)
  select v_dish_id, 'en', trim(p_name_en), nullif(trim(p_description_en), '')
  where nullif(trim(p_name_en), '') is not null
  on conflict (dish_id, lang_code) do update
    set name = excluded.name,
        description = excluded.description,
        updated_at = now();

  return v_legacy_id;
end;
$function$


CREATE OR REPLACE FUNCTION public.delete_dish_legacy_bridge(p_legacy_menu_item_id uuid, p_restaurant_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_org_id uuid;
  v_dish_id uuid;
begin
  v_org_id := public.assert_restaurant_write_access(p_restaurant_id);

  select d.id into v_dish_id
  from public.dishes d
  join public.menus m on m.id = d.menu_id
  join public.venues v on v.id = m.venue_id
  where d.legacy_menu_item_id = p_legacy_menu_item_id
    and v.legacy_restaurant_id = p_restaurant_id
  for update;

  if v_dish_id is null then
    raise exception 'Dish mapping not found.' using errcode = 'P0002';
  end if;

  delete from public.dish_translations where dish_id = v_dish_id;
  delete from public.dishes where id = v_dish_id;
  delete from public.menu_items
  where id = p_legacy_menu_item_id
    and restaurant_id = p_restaurant_id;
end;
$function$


CREATE OR REPLACE FUNCTION public.update_dish_legacy_bridge(p_legacy_menu_item_id uuid, p_restaurant_id uuid, p_category_id uuid, p_category_name text, p_name_en text, p_name_mm text, p_description_en text, p_description_mm text, p_price numeric, p_image_url text, p_is_popular boolean)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_org_id uuid;
  v_dish_id uuid;
  v_currency text;
begin
  v_org_id := public.assert_restaurant_write_access(p_restaurant_id);

  select d.id, v.currency into v_dish_id, v_currency
  from public.dishes d
  join public.menus m on m.id = d.menu_id
  join public.venues v on v.id = m.venue_id
  where d.legacy_menu_item_id = p_legacy_menu_item_id
    and v.legacy_restaurant_id = p_restaurant_id
  for update;

  if v_dish_id is null then
    raise exception 'Dish mapping not found.' using errcode = 'P0002';
  end if;

  update public.menu_items
  set category = coalesce(nullif(trim(p_category_name), ''), category),
      name = coalesce(nullif(trim(p_name_en), ''), nullif(trim(p_name_mm), ''), name),
      name_mm = nullif(trim(p_name_mm), ''),
      price = p_price,
      description = nullif(trim(p_description_en), ''),
      description_mm = nullif(trim(p_description_mm), ''),
      image = nullif(trim(p_image_url), ''),
      is_popular = coalesce(p_is_popular, false)
  where id = p_legacy_menu_item_id
    and restaurant_id = p_restaurant_id;

  if not found then
    raise exception 'Legacy menu item not found.' using errcode = 'P0002';
  end if;

  update public.dishes
  set category_id = p_category_id,
      price = case when upper(v_currency) = 'MMK' then round(p_price)::integer else round(p_price * 100)::integer end,
      image_url = nullif(trim(p_image_url), ''),
      is_popular = coalesce(p_is_popular, false),
      updated_at = now()
  where id = v_dish_id;

  insert into public.dish_translations (dish_id, lang_code, name, description)
  values
    (v_dish_id, 'my', coalesce(nullif(trim(p_name_mm), ''), nullif(trim(p_name_en), '')), nullif(trim(p_description_mm), '')),
    (v_dish_id, 'en', coalesce(nullif(trim(p_name_en), ''), nullif(trim(p_name_mm), '')), nullif(trim(p_description_en), ''))
  on conflict (dish_id, lang_code) do update
    set name = excluded.name,
        description = excluded.description,
        updated_at = now();
end;
$function$


revoke execute on function public.assert_restaurant_write_access(uuid) from anon;
revoke execute on function public.create_dish_legacy_bridge(uuid,uuid,text,text,text,text,text,numeric,text,boolean) from anon;
revoke execute on function public.update_dish_legacy_bridge(uuid,uuid,uuid,text,text,text,text,text,numeric,text,boolean) from anon;
revoke execute on function public.delete_dish_legacy_bridge(uuid,uuid) from anon;
