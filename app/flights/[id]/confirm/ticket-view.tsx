'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { CheckCircle2, ShieldCheck, Printer, Plane, Calendar, Landmark, MapPin, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function TicketView({
  booking,
  passengers = []
}: {
  booking: any
  passengers?: any[]
}) {
  const checkRef = useRef<HTMLDivElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ticket entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(checkRef.current, 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' }
    )
    .fromTo(ticketRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.4'
    )
    .fromTo(actionsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    )
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const departsAt = new Date(booking.flights?.departs_at)
  const departsDate = departsAt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  
  const departsTime = departsAt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 print:my-0">
      
      {/* Visual Success Confirmation Banner */}
      <div className="flex flex-col items-center text-center space-y-4 print:hidden">
        <div ref={checkRef} className="h-16 w-16 flex items-center justify-center rounded-full bg-emerald-500/10 text-success border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-primary dark:text-white">
            Booking Confirmed
          </h1>
          <p className="text-sm text-muted">
            Transacted via 256-bit secure gateway. Your ticket is officially active.
          </p>
        </div>
      </div>

      {/* Boarding Pass Ticket */}
      <div 
        ref={ticketRef} 
        className="w-full rounded-3xl border border-card-border bg-white dark:bg-card shadow-2xl overflow-hidden relative print:shadow-none print:border-slate-300"
      >
        
        {/* Ticket Header Banner */}
        <div className="bg-primary dark:bg-primary px-8 py-5 text-white flex items-center justify-between border-b border-card-border">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 -rotate-45 text-accent" />
            <span className="text-base font-black tracking-tight text-white">
              SKYBOOK BOARDING PASS
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/15 px-2.5 py-1 rounded-full border border-success/30 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>PNR SECURED</span>
          </div>
        </div>

        {/* Boarding details block */}
        <div className="p-8 space-y-8">
          
          {/* Origin and Destination display */}
          <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Origin</span>
              <span className="text-3xl font-black text-primary dark:text-white">
                {booking.flights?.origin}
              </span>
              <span className="text-xs text-slate-500">Departure Station</span>
            </div>

            <div className="flex-1 flex flex-col items-center px-4 relative">
              <div className="w-full h-[1.5px] bg-slate-200 dark:bg-card-border relative flex items-center justify-center">
                <Plane className="absolute h-4 w-4 text-accent rotate-90 bg-white dark:bg-card px-0.5" />
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Destination</span>
              <span className="text-3xl font-black text-primary dark:text-white">
                {booking.flights?.destination}
              </span>
              <span className="text-xs text-slate-500">Arrival Station</span>
            </div>
          </div>

          {/* Ticket metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-card-border">
            <div>
              <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">Flight Number</span>
              <span className="text-sm font-bold text-primary dark:text-white flex items-center gap-1 mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
                {booking.flights?.flight_no}
              </span>
            </div>
            
            <div>
              <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">Departure Date</span>
              <span className="text-sm font-bold text-primary dark:text-white flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                {departsDate}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">Boarding Time</span>
              <span className="text-sm font-bold text-primary dark:text-white flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                {departsTime}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">Seat Number</span>
              <span className="text-sm font-bold text-success flex items-center gap-1 mt-0.5">
                <Landmark className="h-3.5 w-3.5 text-success shrink-0" />
                {booking.seats?.seat_number || 'Unallocated'}
              </span>
            </div>
          </div>

          {/* Passenger Names List */}
          {passengers.length > 0 && (
            <div className="pt-6 border-t border-card-border space-y-3">
              <span className="block text-[10px] font-bold text-muted uppercase tracking-wider">Registered Passengers</span>
              
              <div className="grid gap-3 sm:grid-cols-2">
                {passengers.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 border border-card-border bg-slate-50/50 dark:bg-background/25 px-3.5 py-2.5 rounded-xl">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-accent/25 text-accent text-xs font-black">
                      {idx + 1}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-primary dark:text-white truncate">{p.full_name}</span>
                      <span className="text-[9px] text-muted truncate">Passport: {p.passport_no}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice pricing and PNR info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-card-border bg-slate-50/50 dark:bg-background/25 -mx-8 -mb-8 p-8 border-b rounded-b-3xl">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Secure PNR Code</span>
              <span className="text-2xl font-black text-primary dark:text-white tracking-widest uppercase">
                {booking.pnr_code}
              </span>
            </div>

            {/* Simulated Barcode */}
            <div className="flex flex-col items-center gap-1.5 max-w-[200px]">
              {/* CSS Barcode lines */}
              <div className="h-10 flex items-center justify-center gap-[2.5px] opacity-75 dark:invert">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span 
                    key={i} 
                    className="h-full bg-black rounded"
                    style={{ 
                      width: i % 3 === 0 ? '4px' : i % 5 === 0 ? '1px' : i % 2 === 0 ? '2px' : '3px' 
                    }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                * {booking.id.slice(0, 8)} *
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Fare Authorized (Paid)</span>
              <span className="text-xl font-black text-accent">
                ₹{booking.total_price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Navigation and print tools */}
      <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden pt-4">
        <button
          onClick={handlePrint}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-card-border bg-card text-primary dark:text-white font-bold text-sm px-6 shadow-sm hover:bg-slate-50 dark:hover:bg-background transition-all w-full sm:w-auto"
        >
          <Printer className="h-4.5 w-4.5 text-accent" />
          <span>Print E-Ticket Receipt</span>
        </button>

        <Link
          href="/flights"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary dark:bg-accent dark:text-primary hover:bg-primary/95 text-white font-bold text-sm px-8 shadow-sm transition-all w-full sm:w-auto text-center"
        >
          <span>Find Another Flight</span>
        </Link>
      </div>

    </div>
  )
}
