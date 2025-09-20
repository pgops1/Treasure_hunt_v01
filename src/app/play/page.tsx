'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/utils/supabase' // or supabaseClient

import CaseHeader from '@/components/CaseHeader'
import CaseProgress from '@/components/CaseProgress'

type Question = {
  id: number
  q_order: number
  prompt: string
  answer: string
  narrative?: string | null
}

export default function Play() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [order, setOrder] = useState<number>(1)
  const [total, setTotal] = useState<number | null>(null)
  const [q, setQ] = useState<Question | null>(null)
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState<'ok' | 'bad' | null>(null)
  const [done, setDone] = useState(false)
  const [shake, setShake] = useState(false)
  const [flipping, setFlipping] = useState(false)

  // confetti loader
  const confettiRef = useRef<null | ((opts?: any) => void)>(null)
  const endConfettiOnce = useRef(false)
  useEffect(() => {
    let mounted = true
    import('canvas-confetti').then(
      (m) => mounted && (confettiRef.current = m.default),
    )
    return () => {
      mounted = false
    }
  }, [])
  const burst = (big = false) => {
    if (!confettiRef.current) return
    const c = confettiRef.current
    const common = { spread: 70, startVelocity: 45, ticks: 200 }
    big
      ? (c({ particleCount: 160, angle: 60, origin: { x: 0 }, ...common }),
        c({ particleCount: 160, angle: 120, origin: { x: 1 }, ...common }))
      : c({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
  }

  // auth
  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return router.replace('/login')
      setReady(true)
    })()
  }, [router])

  // total
  useEffect(() => {
    if (!ready) return
    ;(async () => {
      const { count } = await supabase
        .from('questions')
        .select('*', { head: true, count: 'exact' })
      setTotal(count ?? null)
    })()
  }, [ready])

  // load current question
  useEffect(() => {
    if (!ready || done) return
    ;(async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id,q_order,prompt,answer,narrative') // ok even if narrative column doesn't exist? If it errors, switch to just id,q_order,prompt,answer
        .eq('q_order', order)
        .maybeSingle()
      if (error) {
        // if selecting narrative causes error because column doesn't exist, fall back:
        const { data: d2 } = await supabase
          .from('questions')
          .select('id,q_order,prompt,answer')
          .eq('q_order', order)
          .maybeSingle()
        if (!d2) return setDone(true)
        setQ(d2 as Question)
        setInput('')
        setMsg(null)
        return
      }
      if (!data) return setDone(true)
      setQ(data)
      setInput('')
      setMsg(null)
    })()
  }, [ready, order, done])

  // upsert leaderboard on finish
  useEffect(() => {
    if (!(done && total)) return
    ;(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return
      await supabase.from('leaderboard').upsert(
        {
          user_id: session.user.id,
          username: session.user.email,
          score: total,
          finished_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
    })()
  }, [done, total])

  // one-time confetti at end
  useEffect(() => {
    if (done && !endConfettiOnce.current) {
      endConfettiOnce.current = true
      burst(true)
    }
  }, [done])

  if (!ready)
    return <main className="p-6 text-white/90">Checking session…</main>

  // END
  if (done) {
    return (
      <>
        {/* Remove this header if you don't want it */}
        <CaseHeader order={total ?? 0} total={total} title="Case Closed" />
        <main className="mx-auto max-w-5xl p-6 text-center text-white">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-2 text-3xl font-extrabold"
          >
            ✅ Case Closed
          </motion.h2>
          <p className="text-white/80">
            All files solved. Excellent work, Detective.
          </p>
        </main>
      </>
    )
  }

  if (!q) return <main className="p-6 text-white/90">Loading case file…</main>

  const hasNarrative = !!q.narrative && q.narrative.trim().length > 0

  const onSubmit = () => {
    const correct = input.trim().toLowerCase() === q.answer.trim().toLowerCase()
    if (correct) {
      setMsg('ok')
      burst()
      setFlipping(true)
      setTimeout(() => {
        setFlipping(false)
        setMsg(null)
        setOrder((x) => x + 1)
      }, 650)
    } else {
      setMsg('bad')
      setShake(true)
      setTimeout(() => setShake(false), 350)
    }
  }

  return (
    <>
      {/* Remove this header if you don't want it */}
      <CaseHeader order={order} total={total} />

      <main className="mx-auto max-w-5xl p-4">
        <div
          className={`grid gap-6 ${hasNarrative ? 'md:grid-cols-5' : 'md:grid-cols-3'}`}
        >
          {/* Left narrative rail (only if exists) */}
          {hasNarrative && (
            <aside className="rounded border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 md:col-span-2">
              <div className="mb-2 font-semibold tracking-wide">Narrative</div>
              <p>{q.narrative}</p>
              <CaseProgress order={order} total={total} />
            </aside>
          )}

          {/* Center dossier sheet */}
          <section
            className={`${hasNarrative ? 'md:col-span-3' : 'md:col-span-3 md:col-start-1'} `}
          >
            <motion.div
              animate={
                flipping
                  ? { rotateY: [0, 15, -180], opacity: [1, 1, 0] }
                  : { rotateY: 0, opacity: 1 }
              }
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative rounded-lg border border-zinc-300 bg-white p-6 shadow-md"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* header line */}
              <div className="mb-3 flex items-center justify-between">
                <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                  Document: CONFIDENTIAL
                </div>
                <div className="rounded border border-amber-700/60 px-2 py-[2px] font-mono text-[10px] tracking-wider text-amber-700">
                  STAMPED
                </div>
              </div>

              {/* question */}
              <AnimatePresence mode="popLayout">
                <motion.h2
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 text-lg font-semibold text-zinc-900"
                >
                  Question: {q.prompt}
                </motion.h2>
              </AnimatePresence>

              {/* input + submit */}
              <motion.div
                animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.35 }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                  placeholder="Type your answer"
                  className="
      flex-1 rounded border border-zinc-300
      bg-white px-3 py-2
      text-zinc-900 outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-amber-400
    "
                />
                <button
                  onClick={onSubmit}
                  className="rounded bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700"
                >
                  Submit Answer
                </button>
              </motion.div>

              {/* stamps */}
              <div className="relative mt-4 h-12">
                <AnimatePresence>
                  {msg === 'ok' && (
                    <motion.div
                      key="ok"
                      initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
                      animate={{ scale: 1, rotate: -6, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-0 top-0 inline-block rounded border-4 border-emerald-600 px-3 py-1 font-black uppercase tracking-widest text-emerald-700"
                    >
                      File Solved
                    </motion.div>
                  )}
                  {msg === 'bad' && (
                    <motion.div
                      key="bad"
                      initial={{ scale: 0.8, rotate: 6, opacity: 0 }}
                      animate={{ scale: 1, rotate: 6, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-0 top-0 inline-block rounded border-4 border-red-600 px-3 py-1 font-black uppercase tracking-widest text-red-700"
                    >
                      Does Not Match Evidence
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </section>
        </div>
      </main>
    </>
  )
}
