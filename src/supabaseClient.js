import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://TON_PROJET.supabase.co'; // À REMPLACER
const supabaseAnonKey = 'TA_CLE_ANON_ICI';          // À REMPLACER

export const supabase = createClient(supabaseUrl, supabaseAnonKey);