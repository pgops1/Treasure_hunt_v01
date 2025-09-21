'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

type Row = {
  username: string | null
  score: number | null
  finished_at: string | null
}

export default function Leaderboard({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRows = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leaderboard')
      .select('username, score, finished_at')
      .order('score', { ascending: false })
      .order('finished_at', { ascending: true })
    if (!error && data) setRows(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRows()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-lg">
        <h2 className="mb-4 text-xl font-bold">🏆 Leaderboard</h2>
        <button
          onClick={fetchRows}
          className="mb-3 rounded bg-amber-600 px-3 py-1 text-white hover:bg-amber-700"
        >
          Refresh
        </button>
        <button
          onClick={onClose}
          className="mb-3 ml-2 rounded bg-gray-300 px-3 py-1 text-black hover:bg-gray-400"
        >
          Close
        </button>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-gray-200 pb-1"
              >
                <span className="font-medium">{r.username}</span>
                <span>{r.score ?? 0}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
