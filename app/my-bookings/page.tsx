import {
  createSupabaseServerClient,
} from '@/lib/supabase/server'
import Link from 'next/link'
import CancelBookingButton from './cancel-booking-button'
import { ShieldX, Briefcase, Plane, Calendar, Armchair, ShieldCheck } from 'lucide-react'

export default async function MyBookingsPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md rounded-2xl border border-card-border bg-card p-8 text-center space-y-4">
          <ShieldX className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-primary dark:text-white">Authentication Required</h2>
          <p className="text-xs text-muted">Please log in to manage your active booking transactions.</p>
          <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6">
            Log In Securely
          </Link>
        </div>
      </main>
    )
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      flights:flight_id (
        flight_no,
        origin,
        destination,
        departs_at
      ),
      seats:seat_id (
        seat_number
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary dark:text-white flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-accent" />
              <span>My Booking Dashboard</span>
            </h1>
            <p className="text-sm text-muted">
              Manage your active flight itineraries, complete schedules, and handle security holds.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/5 border border-success/15 px-3 py-1.5 rounded-full shrink-0 self-start sm:self-auto">
            <ShieldCheck className="h-4 w-4" />
            <span>Escrow Secure</span>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => {
              const departsAt = new Date(booking.flights?.departs_at)
              const formattedDate = departsAt.toLocaleDateString('en-US', {
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
                <div
                  key={booking.id}
                  className="rounded-2xl border border-card-border bg-white dark:bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    
                    {/* Left Block: Flight Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-card-border px-3 py-1 text-xs font-bold text-muted uppercase tracking-wider">
                          <Plane className="h-3 w-3 -rotate-45 text-accent" />
                          {booking.flights?.flight_no}
                        </span>
                        
                        {/* Status Badge */}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-success border-emerald-500/20'
                              : booking.status === 'cancelled'
                              ? 'bg-red-500/10 text-red-600 border-red-500/20'
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-primary dark:text-white">
                            {booking.flights?.origin}
                          </span>
                        </div>
                        
                        <div className="text-muted font-bold text-sm">→</div>
                        
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-primary dark:text-white">
                            {booking.flights?.destination}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-accent" />
                          {formattedDate} at {departsTime}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400">
                          <Armchair className="h-3.5 w-3.5 text-accent" />
                          Seat {booking.seats?.seat_number || 'Unallocated'}
                        </span>
                        <span className="font-semibold">
                          PNR: <span className="font-bold text-primary dark:text-white uppercase">{booking.pnr_code}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right Block: Actions and Pricing */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4 border-t lg:border-t-0 border-card-border pt-4 lg:pt-0">
                      
                      {/* Price display */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Fare Volume</span>
                        <span className="text-lg font-black text-primary dark:text-white">
                          ₹{booking.total_price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Action buttons drawer */}
                      <div className="flex items-center gap-2">
                        {booking.status !== 'cancelled' && (
                          <CancelBookingButton bookingId={booking.id} />
                        )}
                        
                        {booking.status !== 'cancelled' && (
                          <Link
                            href={`/my-bookings/${booking.id}/reschedule`}
                            className="flex h-10 items-center justify-center rounded-xl bg-primary hover:bg-primary/95 text-white dark:bg-accent dark:text-primary font-bold text-xs px-4 shadow-sm transition-all whitespace-nowrap"
                          >
                            Reschedule
                          </Link>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-card-border bg-card">
              <Briefcase className="h-10 w-10 text-accent mb-3" />
              <h3 className="text-base font-bold text-primary dark:text-white">No active bookings</h3>
              <p className="text-xs text-muted mt-1 max-w-sm">
                You don't have any flights reserved under your profile. Book a trip today to unlock safe escapes!
              </p>
              <Link
                href="/flights"
                className="mt-6 flex h-11 items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs px-6 shadow-sm transition-all"
              >
                Book Flights Now
              </Link>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}