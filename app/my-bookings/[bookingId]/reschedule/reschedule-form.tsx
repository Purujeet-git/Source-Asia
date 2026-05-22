'use client'

import { useState }
from 'react'

import { supabase }
from '@/lib/supabase/client'

import { useFlightStore } from '@/store/flight-store'

import { useRouter }
from 'next/navigation'

export default function
RescheduleForm({
  booking,
  flights,
}: any) {

  const resetStore =
  useFlightStore(
    (state) =>
      state.resetStore
  )

  const router =
    useRouter()

  const [
    selectedFlight,
    setSelectedFlight,
  ] = useState('')

  const handleReschedule =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser()

      if (!user) {
        return
      }

      const selected =
        flights.find(
          (f: any) =>
            f.id === selectedFlight
        )

      if (!selected) {
        return
      }

      // demo seat selection
      // later you can reuse SeatMap

      const {
        data: seat,
      } =
        await supabase

          .from('seats')

          .select('*')

          .eq(
            'flight_id',
            selected.id
          )

          .eq(
            'is_available',
            true
          )

          .limit(1)

          .single()

      if (!seat) {

        alert('No seats available')

        return
      }

      const {
        data,
        error,
      } =
        await supabase.rpc(
          'reschedule_booking',
          {
            p_booking_id:
              booking.id,

            p_user_id:
              user.id,

            p_new_flight_id:
              selected.id,

            p_new_seat_id:
              seat.id,
          }
        )

      if (error) {

        console.log(error)

        return
      }

      alert(
        `Rescheduled successfully. Extra fee: ₹${data.fee_charged}`
      )

      resetStore()

      router.push('/my-bookings')
    }

  return (

    <div className="space-y-6">

      <select
        value={selectedFlight}

        onChange={(e) =>
          setSelectedFlight(
            e.target.value
          )
        }

        className="
          w-full
          rounded-lg
          border
          p-3
        "
      >

        <option value="">
          Select New Flight
        </option>

        {flights.map(
          (flight: any) => (

            <option
              key={flight.id}
              value={flight.id}
            >

              {flight.flight_no}
              {' - '}
              ₹{flight.base_price}

            </option>
          )
        )}

      </select>

      <button
        onClick={handleReschedule}

        className="
          rounded-lg
          bg-black
          px-6
          py-3
          text-white
        "
      >

        Confirm Reschedule

      </button>

    </div>
  )
}