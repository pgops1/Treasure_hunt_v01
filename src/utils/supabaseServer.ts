import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        // 👇 no set/remove here (Next.js disallows it outside actions)
        set() {},
        remove() {},
      },
    },
  )
}
