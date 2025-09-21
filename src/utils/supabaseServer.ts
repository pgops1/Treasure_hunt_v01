// src/utils/supabaseServer.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // ❌ can't set cookies here in app router safely
        },
        remove() {
          // ❌ can't remove cookies here in app router safely
        },
      },
    },
  )
}
