'use client'

import { useEffect, useRef, Suspense, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Plane, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Award, 
  CheckCircle2, 
  Users, 
  Globe2, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import FlightSearchForm from '@/components/flight/FlightSearchForm'

// Register GSAP ScrollTrigger plugin for dynamic scroll-linked entrance animations
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<any>
}) {
  // Unwrap searchParams promise using React.use() to comply with Next.js 15+ dynamic APIs
  if (searchParams) {
    use(searchParams)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const securityRef = useRef<HTMLDivElement>(null)
  const destinationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero elements entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
        .from('.hero-title', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-search', { y: 40, opacity: 0, duration: 1.0, ease: 'back.out(1.2)' }, '-=0.5')
        .from('.hero-stats', { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.6')

      // Scroll animations for features
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      })

      // Security cards zoom entrance
      gsap.from('.security-badge', {
        scrollTrigger: {
          trigger: securityRef.current,
          start: 'top 85%',
        },
        scale: 0.85,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.5)'
      })

      // Destinations slide-up
      gsap.from('.destination-card', {
        scrollTrigger: {
          trigger: destinationsRef.current,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const securityTrustPoints = [
    {
      icon: ShieldCheck,
      title: "PCI-DSS Level 1 Compliant",
      description: "Our payment systems meet the absolute highest bank-grade certification standards to ensure your card data is fully fortified.",
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      icon: CreditCard,
      title: "3D Secure Authorization",
      description: "Every credit/debit card purchase triggers multi-factor bank authentication protecting you against unauthorized charges.",
      color: "text-accent bg-accent/10"
    },
    {
      icon: Clock,
      title: "24-Hour Active Lock Guarantee",
      description: "Lock flight seats instantly for 24 hours at the matching base price before finalizing your final passport detail checks.",
      color: "text-sky-500 bg-sky-500/10"
    }
  ]

  const featuredDestinations = [
    {
      name: "Paris, France",
      code: "CDG",
      price: "₹34,999",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop",
      tag: "Cultural Capital"
    },
    {
      name: "Tokyo, Japan",
      code: "NRT",
      price: "₹42,500",
      rating: "4.95",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?q=80&w=600&auto=format&fit=crop",
      tag: "Modern & Historic"
    },
    {
      name: "Bali, Indonesia",
      code: "DPS",
      price: "₹21,800",
      rating: "4.85",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop",
      tag: "Tropical Haven"
    }
  ]

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-background min-h-screen">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none z-0 opacity-40 dark:opacity-30">
        <div className="absolute -top-[200px] left-[10%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute -top-[150px] right-[10%] w-[600px] h-[600px] rounded-full bg-primary/30 blur-[150px]" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
          
          {/* Tagline Badge */}
          <div className="hero-badge inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-accent bg-accent/10 border border-accent/20 mb-6 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Elevated Flight Booking Experience</span>
          </div>

          {/* Heading */}
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary dark:text-white mb-6 leading-tight">
            Journey with Complete <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">Confidence</span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">
            Discover unmatched routes, book instantly using 100% secure payment systems, and experience luxury travel powered by SkyBook.
          </p>
        </div>

        {/* Floating Search Widget */}
        <div className="hero-search w-full max-w-5xl mx-auto mb-16 shadow-2xl rounded-3xl border border-card-border p-1 bg-card/65 dark:bg-card/40 premium-glass">
          <Suspense fallback={
            <div className="w-full bg-white dark:bg-card rounded-2xl p-6 shadow-md transition-all animate-pulse h-[200px]">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
              <div className="grid gap-4 md:grid-cols-4 items-end">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          }>
            <FlightSearchForm />
          </Suspense>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto pt-4 border-t border-card-border">
          {[
            { value: "99.99%", label: "Safe Booking Rate", icon: CheckCircle2, color: "text-success" },
            { value: "24/7", label: "Dedicated Support", icon: Users, color: "text-accent" },
            { value: "140+", label: "Global Destinations", icon: Globe2, color: "text-sky-500" },
            { value: "0% Fees", label: "No Hidden Costs", icon: Award, color: "text-amber-500" }
          ].map((stat, idx) => {
            const StatIcon = stat.icon
            return (
              <div key={idx} className="hero-stats flex flex-col items-center md:items-start p-4 text-center md:text-left">
                <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                  <StatIcon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-2xl font-black tracking-tight text-primary dark:text-white">{stat.value}</span>
                </div>
                <span className="text-xs font-semibold text-muted tracking-wide uppercase">{stat.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Trust & Bank-Grade Security Section */}
      <section ref={securityRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-card-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary dark:text-white sm:text-4xl mb-4">
              Bank-Grade Payment Security
            </h2>
            <p className="text-lg text-muted">
              We employ military-grade AES-256 encryption. Your payments are completely guarded through official gateways without middleman risks.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {securityTrustPoints.map((point, index) => {
              const PointIcon = point.icon
              return (
                <div 
                  key={index}
                  className="security-badge flex flex-col items-start p-8 rounded-2xl border border-card-border bg-background transition-all hover:shadow-lg dark:hover:shadow-black/35 hover:-translate-y-1 group"
                >
                  <div className={`p-3 rounded-xl mb-6 ${point.color} transition-transform group-hover:scale-105`}>
                    <PointIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-primary dark:text-white mb-2">
                    {point.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {point.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Secure Payment Badges Drawer */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 mt-12 border-t border-card-border opacity-70">
            <div className="flex items-center gap-2 border border-card-border px-4 py-2 rounded-xl bg-background/50">
              <span className="text-xs font-bold text-muted">Secured via SSL</span>
            </div>
            <div className="flex items-center gap-2 border border-card-border px-4 py-2 rounded-xl bg-background/50">
              <span className="text-xs font-bold text-muted">Verified by Visa</span>
            </div>
            <div className="flex items-center gap-2 border border-card-border px-4 py-2 rounded-xl bg-background/50">
              <span className="text-xs font-bold text-muted">Mastercard Identity Check</span>
            </div>
            <div className="flex items-center gap-2 border border-card-border px-4 py-2 rounded-xl bg-background/50">
              <span className="text-xs font-bold text-muted">American Express SafeKey</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section ref={destinationsRef} className="py-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary dark:text-white sm:text-4xl mb-4">
              Fly to Featured Havens
            </h2>
            <p className="text-base text-muted">
              Handpicked luxury destinations starting at premium base prices. Start your seamless escape today.
            </p>
          </div>
          <Link 
            href="/flights" 
            className="group inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors mt-4 sm:mt-0"
          >
            <span>View all flights</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map((dest, index) => (
            <div 
              key={index} 
              className="destination-card group relative flex flex-col overflow-hidden rounded-3xl border border-card-border bg-card shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Picture Frame */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Visual Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Category Tag */}
                <div className="absolute top-4 left-4 rounded-full bg-primary/80 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider">
                  {dest.tag}
                </div>
              </div>

              {/* Detail Box */}
              <div className="flex flex-col p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-primary dark:text-white">
                    {dest.name}
                  </h3>
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-card-border text-accent">
                    {dest.code}
                  </span>
                </div>
                
                <p className="text-sm text-muted mb-6">
                  Experience dynamic culture, stunning sights, and safe transport.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-card-border mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Starting from</span>
                    <span className="text-xl font-black text-primary dark:text-white">{dest.price}</span>
                  </div>
                  <Link
                    href={`/flights?destination=${dest.name.split(',')[0]}`}
                    className="flex h-10 items-center justify-center rounded-xl bg-primary dark:bg-accent dark:text-primary hover:bg-primary/90 text-white font-bold text-xs px-4 shadow-sm transition-all"
                  >
                    Find Flights
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Reassurance Footer Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-card-border bg-card">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-xl">
            <h3 className="text-xl font-extrabold text-primary dark:text-white mb-2">
              Secure Money-Back Guarantee
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              If your plans change or a flight is cancelled, rest assured knowing we offer instant credits or direct refund guarantees straight to your payment method.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <Link
              href="/flights"
              className="flex h-12 w-full md:w-[180px] items-center justify-center rounded-full bg-primary hover:bg-primary/95 text-white font-bold transition-all shadow-md shadow-primary/20 dark:shadow-none"
            >
              Book A Trip Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
