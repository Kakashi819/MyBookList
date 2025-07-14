import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

// Create Supabase client - use service key if available, otherwise use anon key
const supabaseKey = config.supabase.serviceKey && config.supabase.serviceKey !== 'your_supabase_service_key_here' 
  ? config.supabase.serviceKey 
  : config.supabase.anonKey;

export const supabase = createClient(
  config.supabase.url,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Public client for frontend operations (uses anon key)
export const supabasePublic = createClient(
  config.supabase.url,
  config.supabase.anonKey
);
