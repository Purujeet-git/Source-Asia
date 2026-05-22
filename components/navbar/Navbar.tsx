'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { Plane, User, LogOut, Briefcase, Menu, X, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { name: 'Book Flights', href: '/flights', icon: Plane },
    { name: 'My Bookings', href: '/my-bookings', icon: Briefcase },
  ]

  return (
    <header className="sticky top-0 z-50 w-full premium-glass border-b border-card-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-accent transition-transform group-hover:scale-105">
                <Plane className="h-5 w-5 -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary dark:text-white">
                Sky<span className="text-accent">Book</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const LinkIcon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors py-2 px-3 rounded-lg ${
                    isActive
                      ? 'text-accent bg-primary/10 dark:bg-accent/10'
                      : 'text-muted hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="h-4 w-4" />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA / Auth */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>PCI-DSS Secured</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-white bg-card-border px-3 py-1.5 rounded-lg">
                  <User className="h-4 w-4 text-accent" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-primary dark:text-white hover:text-accent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-primary hover:bg-primary/95 text-white dark:bg-accent dark:hover:bg-accent/90 dark:text-primary px-4 py-2 text-sm font-semibold shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:bg-primary/10 hover:text-primary dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-card-border bg-card p-4 space-y-4">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const LinkIcon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-base font-semibold py-2.5 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-accent bg-primary/10 dark:bg-accent/10'
                      : 'text-muted hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="h-5 w-5" />
                  {link.name}
                </Link>
              )
            })}
          </div>

          <div className="border-t border-card-border pt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full border border-success/20 w-fit">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure Encrypted Connection</span>
            </div>

            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-white bg-card-border px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-accent" />
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)}
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-card-border py-2 text-sm font-semibold text-primary dark:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-primary py-2 text-sm font-semibold text-white dark:bg-accent dark:text-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
