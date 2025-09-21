'use client'

import { useState } from 'react'
import Leaderboard from './Leaderboard'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function TopBar() {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-zinc-900 px-6 py-3 text-white shadow">
      {/* Left side - Title */}
      <h1 className="text-lg font-bold">📂 Treasure Hunt</h1>

      {/* Right side - Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowLeaderboard(true)}
          className="rounded bg-amber-600 px-4 py-2 font-semibold hover:bg-amber-700"
        >
          🏆 Leaderboard
        </button>
        <button
          onClick={handleLogout}
          className="rounded bg-red-600 px-4 py-2 font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </header>
  )
}
