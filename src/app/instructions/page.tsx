'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

export default function Instructions() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    loadUser()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <main style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center' }}>
      <h1>🗺️ Treasure Hunt</h1>
      <p style={{ margin: '12px 0', fontWeight: 'bold' }}>
        Welcome {user?.email || 'Detective'}!
      </p>
      <p style={{ margin: '20px 0' }}>
        &quot;You&apos;re about to step into an investigation — twelve clues, one case.
        Each screen will present you with a question. Enter your answer in the box,
        and only the correct response will unlock the next file. Stay sharp —
        partial answers may still count, but only if they match the evidence.&quot;
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={() => router.push('/play')}
          style={{ padding: '12px 24px' }}
        >
          Start the Hunt 🚀
        </button>
        <button onClick={handleSignOut} style={{ padding: '12px 24px' }}>
          Sign Out
        </button>
      </div>
    </main>
  )
}
