import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

export function createClient<Database>() {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  client.auth.set

  return client;
}