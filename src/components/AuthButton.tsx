import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/utils/supabaseServer'

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <form action="/login">
        <button
          type="submit"
          className="rounded bg-indigo-600 px-3 py-1 text-white"
        >
          Login
        </button>
      </form>
    )
  }

  return (
    <form action="/logout" method="post">
      <button type="submit" className="rounded bg-red-600 px-3 py-1 text-white">
        Logout
      </button>
    </form>
  )
}
