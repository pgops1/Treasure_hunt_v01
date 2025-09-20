'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  // 🔄 If already logged in → redirect to /play
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace('/play')
      }
    }
    checkSession()
  }, [router])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMsg(error.message)
    } else {
      router.replace('/play')
    }
  }

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMsg(error.message)
    } else {
      setMsg('📩 Check your email to confirm your account.')
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', padding: 20 }}>
      <h2>Login / Sign Up</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{
          display: 'block',
          marginBottom: 10,
          width: '100%',
          padding: 8,
        }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        style={{
          display: 'block',
          marginBottom: 10,
          width: '100%',
          padding: 8,
        }}
      />

      <button onClick={handleSignIn} style={{ marginRight: 10 }}>
        Sign In
      </button>
      <button onClick={handleSignUp}>Sign Up</button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  )
}
