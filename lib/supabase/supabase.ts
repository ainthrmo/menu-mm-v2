import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nkaunvzoebkuzktrmaft.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rYXVudnpvZWJrdXprdHJtYWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNDg4NTMsImV4cCI6MjEwMTYyNDg1M30.8nSjdgC_SRIpzt16h7W8WkGtlNmO3TqMFjvrhI5yzI4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);