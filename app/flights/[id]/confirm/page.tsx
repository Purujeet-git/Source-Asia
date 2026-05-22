import {
  createSupabaseServerClient,
} from '@/lib/supabase/server'
import TicketView from './ticket-view'
import { ShieldX } from 'lucide-react'
import Link from 'next/link'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    bookingId?: string
  }>
}) {

  const params = await searchParams

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
          <p className="text-xs text-muted">Please log in to view and download your secure ticket confirmation.</p>
          <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6">
            Log In Securely
          </Link>
        </div>
      </main>
    )
  }

  const bookingId = params.bookingId

  if (!bookingId) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md rounded-2xl border border-card-border bg-card p-8 text-center space-y-4">
          <ShieldX className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-primary dark:text-white">Missing Booking ID</h2>
          <p className="text-xs text-muted">We couldn't track your booking because the booking code parameter was missing.</p>
          <Link href="/flights" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6">
            Search Flights
          </Link>
        </div>
      </main>
    )
  }

  // Fetch Booking Details with Flights & Seats relation
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      flights:flight_id (*),
      seats:seat_id (*)
    `)
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()

  if (!booking) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md rounded-2xl border border-card-border bg-card p-8 text-center space-y-4">
          <ShieldX className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-primary dark:text-white">Booking Not Found</h2>
          <p className="text-xs text-muted">The requested booking does not exist under your user credentials or has been cancelled.</p>
          <Link href="/flights" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6">
            Search Flights
          </Link>
        </div>
      </main>
    )
  }

  // Fetch Registered Passengers for this booking
  const { data: passengers } = await supabase
    .from('passengers')
    .select('*')
    .eq('booking_id', bookingId)

  return (
    <main className="flex min-h-screen items-center justify-center bg-background py-16 px-4 sm:px-6 lg:px-8">
      <TicketView 
        booking={booking} 
        passengers={passengers || []} 
      />
    </main>
  )
}