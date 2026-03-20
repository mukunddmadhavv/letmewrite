import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Stub so the app renders even without real Supabase credentials
const stubClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured. Add credentials to .env' } }),
    signUp: async () => ({ data: null, error: { message: 'Supabase not configured. Add credentials to .env' } }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured.' } }) }) }),
    select: () => ({ eq: () => ({ order: async () => ({ data: [], error: null }), single: async () => ({ data: null, error: null }) }) }),
  }),
};

let supabase;
try {
  if (!supabaseUrl || supabaseUrl === 'your_supabase_url') throw new Error('No URL');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch {
  console.warn('⚠️  Supabase credentials not set. Using stub client. Update .env to enable auth.');
  supabase = stubClient;
}

export { supabase };
