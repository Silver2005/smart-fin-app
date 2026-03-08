import { createClient } from '@supabase/supabase-js';

// Configuration de ton projet SILVER-FIN Cloud
const supabaseUrl = 'https://tfvjzuvnrslbcluflshs.supabase.co';
const supabaseAnonKey = 'sb_publishable_Jx82WIlIHqCcXuvY3iH4PA_Hp4SCBVt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);