import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data } = await supabase.auth.getSession()

  if (data?.session) {
    redirect('/play') // already logged in → play
  } else {
    redirect('/login') // not logged in → login
  }

  return null // nothing is shown because of redirect
}
