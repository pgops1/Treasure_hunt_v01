'use client'
import { useEffect, useRef, useState } from 'react'
import Leaderboard from '@/components/Leaderboard'

type Props = { order: number; total?: number | null }

export default function CaseHeader({ order, total }: Props) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  // click outside to close
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return
      if (!panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <header className="relative w-full border-b border-zinc-200 bg-amber-50/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
        <div className="text-base font-extrabold tracking-wide">
          📁 Case File #{order}
          {total ? ` / ${total}` : ''}
        </div>

        {/* Leaderboard toggle */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
            aria-expanded={open}
            aria-haspopup="true"
          >
            🏆 Leaderboard
          </button>

          {open && (
            <div
              className="absolute right-0 top-full z-50 mt-2"
              role="dialog"
              aria-label="Leaderboard"
            >
              <Leaderboard embed className="w-80" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
