import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/utils/supabaseServer'

export default async function Home() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.auth.getSession()

  if (data?.session) {
    redirect('/play') // already logged in → play
  } else {
    redirect('/login') // not logged in → login
  }

  return null // nothing is shown because of redirect
}
