'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // 🔑 Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.replace('/instructions')
    }
  }

  // 📝 Sign-up
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.replace('/instructions')
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      <h1>🔐 Login or Sign Up</h1>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />
        <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
          Login
        </button>
        <button onClick={handleSignUp} style={{ padding: '10px 20px' }}>
          Sign Up
        </button>
      </form>
      {error && <p style={{ marginTop: 12, color: 'red' }}>{error}</p>}
    </main>
  )
}
