import { createClient } from '@supabase/supabase-js'

// Public project URL and publishable (anon) key. Both are safe in the browser:
// row-level security in supabase/migrations/0001_init.sql limits every user to their own rows.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key
  ? createClient(url, key, {
    auth: {
      // PKCE returns ?code= in the query string, which keeps our #/screen routes intact.
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'mindleaf-auth',
    },
  })
  : null

export const isLive = Boolean(supabase)
