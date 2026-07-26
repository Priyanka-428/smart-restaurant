'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/staff')
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Staff Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.7rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '0.7rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
          required
        />
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <button
          type="submit"
          style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: 'none', backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Log In
        </button>
      </form>
    </main>
  )
}