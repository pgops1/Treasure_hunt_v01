'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

type Row = {
  username: string | null
  score: number | null
  finished_at: string | null
}

type Props = {
  /** When true, renders as a simple card you can place anywhere (no fixed positioning). */
  embed?: boolean
  className?: string
}

export default function Leaderboard({ embed = false, className = '' }: Props) {
  const [rows, setRows] = useState<Row[]>([])

  async function fetchData() {
    const { data } = await supabase
      .from('leaderboard')
      .select('username, score, finished_at')
      .order('score', { ascending: false })
      .order('finished_at', { ascending: true })
      .limit(10)
    setRows(data || [])
  }

  useEffect(() => {
    fetchData()
    const ch = supabase
      .channel('lb_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        fetchData,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(ch)
    }
  }, [])

  const rankIcon = (i: number) =>
    i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`

  const Card = (
    <aside
      className={`w-72 rounded-xl bg-slate-800 p-4 text-slate-50 shadow-xl ring-1 ring-black/10 ${className}`}
    >
      <h3 className="mb-3 text-lg font-bold">🏆 Leaderboard</h3>
      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="flex items-center justify-between">
            <span>
              <span className="inline-block w-7">{rankIcon(i)}</span>
              {r.username ?? 'Player'}
            </span>
            <span className="font-bold text-sky-300">{r.score ?? 0}</span>
          </li>
        ))}
      </ol>
    </aside>
  )

  // fixed “old” mode (kept for convenience)
  if (!embed) {
    return (
      <div className="fixed right-5 top-24 z-40 hidden md:block">{Card}</div>
    )
  }

  // embedded mode (for dropdowns/headers)
  return Card
}
