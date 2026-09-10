import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// True only when real Supabase project credentials are present in .env
export const isSupabaseConfigured = Boolean(
	supabaseUrl && 
	supabaseAnonKey && 
	!supabaseUrl.includes('YOUR_SUPABASE_PROJECT_URL')
);

export const supabase = isSupabaseConfigured 
	? createClient(supabaseUrl, supabaseAnonKey) 
	: null;

if (!isSupabaseConfigured) {
	console.warn('Supabase initialization failed: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or invalid in .env.local');
}
