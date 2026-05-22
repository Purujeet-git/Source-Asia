import { createSupabaseServerClient } from '@/lib/supabase/server'
import SeatMap from './seat-map'
import BookingForm from './booking-form'
import { Plane, ShieldCheck, CreditCard } from 'lucide-react'

export default async function FlightDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()

  const { data: flight } = await supabase
    .from('flights')
    .select('*')
    .eq('id', id)
    .single()

  const { data: seats } = await supabase
    .from('seats')
    .select('*')
    .eq('flight_id', id)

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Route Header Banner */}
        {flight && (
          <div className="rounded-2xl border border-card-border bg-white dark:bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-1">
                  <Plane className="h-3.5 w-3.5 -rotate-45" />
                  <span>Configure Escrow Booking</span>
                </div>
                <h1 className="text-2xl font-black text-primary dark:text-white">
                  {flight.origin} to {flight.destination}
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  Flight No: {flight.flight_no} • Aircraft: {flight.aircraft_type}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>PCI secured checkout</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Verified Escrow Gateway</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <SeatMap seats={seats || []} />

          <BookingForm
            flight={flight}
          />
        </div>
      </div>
    </main>
  )
}
