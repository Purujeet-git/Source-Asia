'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Mail, Lock, LogIn, Plane } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all credentials')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    router.push('/flights')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] overflow-hidden pointer-events-none z-0 opacity-40 dark:opacity-30">
        <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-accent/25 blur-[100px]" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-card-border bg-white dark:bg-card p-8 shadow-xl relative z-10">
        
        {/* Secure Banner Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-accent shadow-sm mb-4">
            <Plane className="h-6 w-6 -rotate-45" />
          </div>
          
          <h1 className="text-2xl font-black text-primary dark:text-white">
            Access SkyBook
          </h1>
          <p className="text-xs text-muted mt-1 max-w-[280px]">
            Log in to manage active routes, secure seat locks, and complete safe checkouts.
          </p>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
              <Mail className="h-3 w-3 text-accent" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-background/40 py-3 px-4 text-sm font-semibold transition-all focus:border-accent focus:bg-white dark:focus:bg-card focus:outline-none text-primary dark:text-white"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Lock className="h-3 w-3 text-accent" />
                <span>Password</span>
              </label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-background/40 py-3 px-4 text-sm font-semibold transition-all focus:border-accent focus:bg-white dark:focus:bg-card focus:outline-none text-primary dark:text-white"
            />
          </div>

          {/* Secure Trust Stamp */}
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3 text-[10px] text-success font-semibold">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Encrypted login gateway. Your password remains 100% private.</span>
          </div>

          {/* CTA Action */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary dark:bg-accent dark:text-primary hover:bg-primary/95 text-white py-3.5 text-sm font-bold shadow-md hover:scale-[1.01] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-primary border-t-transparent" />
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Log In Securely</span>
              </>
            )}
          </button>

          {/* Redirect Options */}
          <div className="text-center pt-4 border-t border-card-border mt-6">
            <p className="text-xs text-muted">
              Don't have a secure profile?{' '}
              <Link href="/signup" className="font-bold text-accent hover:text-accent/80 transition-colors">
                Register profile
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}