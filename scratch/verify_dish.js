// verify_dish.js - end-to-end verification of dish creation after fix

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase config missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getFirstRestaurant() {
  const { data, error } = await supabase.from('restaurants').select('id').limit(1).single();
  if (error) throw error;
  return data.id;
}

async function getFirstCategory(restaurantId) {
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .limit(1)
    .single();
  if (error) return null; // category may not exist
  return data.id;
}

async function createDish(restaurantId, categoryId) {
  const res = await supabase.rpc('create_dish_legacy_bridge', {
    p_restaurant_id: restaurantId,
    p_category_id: categoryId,
    p_category_name: null,
    p_name_en: 'Test Dish',
    p_name_mm: null,
    p_description_en: 'A test dish for verification',
    p_description_mm: null,
    p_price: 5.99,
    p_image_url: null,
    p_is_popular: false,
  });
  return res;
}

(async () => {
  try {
    const restaurantId = await getFirstRestaurant();
    console.log('Using restaurantId', restaurantId);
    const categoryId = await getFirstCategory(restaurantId);
    console.log('Using categoryId', categoryId);

    console.log('--- Valid creation ---');
    const valid = await createDish(restaurantId, categoryId);
    console.log('Result', valid);
    if (valid.error) throw valid.error;
    const legacyId = valid.data;
    console.log('Legacy menu item ID', legacyId);

    // Verify dish linked to menu
    const { data: dish, error: dishErr } = await supabase
      .from('dishes')
      .select('id, menu_id')
      .eq('legacy_menu_item_id', legacyId)
      .single();
    if (dishErr) throw dishErr;
    console.log('Created dish', dish);

    // Verify menu belongs to same restaurant
    const { data: menu, error: menuErr } = await supabase
      .from('menus')
      .select('id, restaurant_id')
      .eq('id', dish.menu_id)
      .single();
    if (menuErr) throw menuErr;
    console.log('Menu for dish', menu);

    console.log('--- Invalid restaurant (random UUID) ---');
    const bogusId = '11111111-1111-1111-1111-111111111111';
    const invalid = await createDish(bogusId, null);
    console.log('Invalid result', invalid);
  } catch (e) {
    console.error('Error during verification', e);
  }
})();
