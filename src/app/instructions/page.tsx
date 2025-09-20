'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'

export default function Instructions() {
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <main style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center' }}>
      <h1>🗺️ Treasure Hunt</h1>
      <p style={{ margin: '20px 0' }}>
        Solve each question to unlock the next clue. No skipping. Good luck!
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
