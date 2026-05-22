import {
  createSupabaseServerClient,
} from '@/lib/supabase/server'

import RescheduleForm
from './reschedule-form'

export default async function
ReschedulePage({
  params,
}: {
  params: Promise<{
    bookingId: string
  }>
}) {

  const { bookingId } =
    await params

  const supabase =
    await createSupabaseServerClient()

  const {
    data: booking,
  } = await supabase

    .from('bookings')

    .select(`
      *,
      flights:flight_id (*)
    `)

    .eq('id', bookingId)

    .single()

  if (!booking) {

    return (
      <div className="p-10">
        Booking not found
      </div>
    )
  }

  // same route flights

  const {
    data: flights,
  } = await supabase

    .from('flights')

    .select('*')

    .eq(
      'origin',
      booking.flights.origin
    )

    .eq(
      'destination',
      booking.flights.destination
    )

    .neq(
      'id',
      booking.flight_id
    )

  return (

    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="mb-8 text-3xl font-bold">

          Reschedule Booking

        </h1>

        <RescheduleForm
          booking={booking}
          flights={flights || []}
        />

      </div>

    </main>
  )
}