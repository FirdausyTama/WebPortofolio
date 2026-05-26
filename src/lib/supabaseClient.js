import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Deteksi apakah kredensial database sudah dikonfigurasi di file .env atau Vercel
export const isSupabaseConfigured = !!(
  supabaseUrl.trim() && 
  supabaseAnonKey.trim() && 
  !supabaseUrl.includes('xxxxxxxxxxxxxxxxxxxx')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
