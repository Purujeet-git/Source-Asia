'use client'

import { supabase }
from '@/lib/supabase/client'

import { useRouter }
from 'next/navigation'

import { useFlightStore } from '@/store/flight-store'

export default function
CancelBookingButton({
  bookingId,
}: {
  bookingId: string
}) {

  const resetStore =
  useFlightStore(
    (state) =>
      state.resetStore
  )

  const router =
    useRouter()

  const handleCancel =
    async () => {

      const confirmed =
        confirm(
          'Are you sure you want to cancel this booking?'
        )

      if (!confirmed) {
        return
      }

      const {
        data: { user },
      } =
        await supabase.auth.getUser()

      if (!user) {
        return
      }

      const {
        data,
        error,
      } =
        await supabase.rpc(
          'cancel_booking',
          {
            p_booking_id:
              bookingId,

            p_user_id:
              user.id,
          }
        )

      if (error) {

        console.log(error)

        alert(
          'Cancellation failed'
        )

        return
      }

      if (!data?.success) {

        alert(data.message)

        return
      }

      resetStore()

      router.refresh()
    }

  return (

    <button
      onClick={handleCancel}

      className="
        rounded-lg
        bg-red-500
        px-4
        py-2
        text-white
        hover:bg-red-600
      "
    >

      Cancel Booking

    </button>
  )
}