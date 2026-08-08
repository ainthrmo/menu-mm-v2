import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nkaunvzoebkuzktrmaft.supabase.co";
const supabaseAnonKey = "sb_publishable_Y0778cteIunsDVFo8IaMng_bCC_rsI6";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);