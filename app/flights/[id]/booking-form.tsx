'use client'

import { Flight } from '@/types/flight'
import { useBookingStore } from '@/store/bookingStore'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useFlightStore } from '@/store/flight-store'
import { ShieldCheck, Lock, User, FileText, Globe, Landmark, Users } from 'lucide-react'

export default function BookingForm({
  flight,
}: {
  flight: Flight
}) {
  const resetStore = useFlightStore((state) => state.resetStore)
  const router = useRouter()

  const {
    selectedSeatId,
    selectedSeatNumber,
    passengerCount,
    setPassengerCount,
  } = useBookingStore()

  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      full_name: '',
      passport_no: '',
      nationality: '',
    }))
  )

  const [loading, setLoading] = useState(false)

  // Keep passenger array length synced when passengerCount changes
  useEffect(() => {
    setPassengers((prev) => {
      const diff = passengerCount - prev.length
      if (diff > 0) {
        return [
          ...prev,
          ...Array.from({ length: diff }, () => ({
            full_name: '',
            passport_no: '',
            nationality: '',
          })),
        ]
      } else if (diff < 0) {
        return prev.slice(0, passengerCount)
      }
      return prev
    })
  }, [passengerCount])

  const handlePassengerChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedPassengers = [...passengers]
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    }
    setPassengers(updatedPassengers)
  }

  const handleBooking = async () => {
    const hasEmptyFields = passengers.some(
      (passenger) =>
        !passenger.full_name.trim() ||
        !passenger.passport_no.trim() ||
        !passenger.nationality.trim()
    )

    if (hasEmptyFields) {
      alert('Please fill all passenger fields')
      return
    }

    if (!selectedSeatId) {
      alert('Please select a seat from the aircraft seat map first')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Please login to complete your booking')
      setLoading(false)
      router.push('/login')
      return
    }

    const { data, error } = await supabase.rpc('reserve_seat', {
      p_user_id: user.id,
      p_flight_id: flight.id,
      p_seat_id: selectedSeatId,
      p_total_price: flight.base_price * passengerCount, // Calculate based on passenger count!
    })

    if (error) {
      console.log(error)
      alert('Seat reservation failed. Please try another seat.')
      setLoading(false)
      return
    }

    if (!data?.success) {
      alert(data?.message || 'Failed to reserve seat.')
      setLoading(false)
      return
    }

    const bookingId = data?.booking_id

    const passengerPayload = passengers.map((passenger) => ({
      booking_id: bookingId,
      full_name: passenger.full_name.trim(),
      passport_no: passenger.passport_no.trim(),
      nationality: passenger.nationality.trim(),
      dob: '2000-01-01',
    }))

    const { error: passengerError } = await supabase
      .from('passengers')
      .insert(passengerPayload)

    if (passengerError) {
      console.log(passengerError)
      alert('Failed to register passengers. Contact support.')
      setLoading(false)
      return
    }

    if (!bookingId) {
      alert('Booking ID missing from gateway.')
      return
    }

    resetStore()
    router.push(`/flights/${flight.id}/confirm?bookingId=${bookingId}`)
  }

  return (
    <div className="w-full bg-white dark:bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-primary dark:bg-primary px-6 py-5 border-b border-card-border flex items-center justify-between text-white">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white dark:text-accent">
            Secure Booking Form
          </h2>
          <p className="text-xs text-slate-300">
            SSL encrypted connection ensures maximum safety.
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
          <Lock className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Passenger count selector */}
        <div className="bg-slate-50 dark:bg-background/50 border border-card-border rounded-xl p-4">
          <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span>Select Ticket Volume</span>
          </label>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold text-muted">
              How many passengers are traveling?
            </span>
            <input
              type="number"
              min={1}
              max={6}
              value={passengerCount}
              onChange={(e) => {
                const count = Math.min(6, Math.max(1, Number(e.target.value)))
                setPassengerCount(count)
              }}
              className="w-20 rounded-lg border border-card-border bg-white dark:bg-card p-2 text-center text-sm font-bold text-primary dark:text-white focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Passenger Inputs */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider border-b border-card-border pb-2 flex items-center gap-2">
            <span>Passenger Information</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-black">
              {passengerCount} {passengerCount === 1 ? 'PAX' : 'PAXS'}
            </span>
          </h3>

          <div className="space-y-6 max-h-87.5 overflow-y-auto pr-2">
            {passengers.map((passenger, index) => (
              <div
                key={index}
                className="space-y-4 border border-card-border bg-slate-50/40 dark:bg-background/20 p-4 rounded-xl relative"
              >
                <div className="absolute top-2.5 right-4 text-[10px] font-black text-slate-300 dark:text-slate-700">
                  PAX #{index + 1}
                </div>

                <h4 className="text-xs font-bold text-primary dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3 text-accent" />
                  <span>Passenger {index + 1}</span>
                </h4>

                {/* Name */}
                <div className="relative">
                  <span className="absolute left-3 top-3.5 z-10 text-muted">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    placeholder="Full Name (as in Passport)"
                    value={passenger.full_name}
                    onChange={(e) =>
                      handlePassengerChange(index, 'full_name', e.target.value)
                    }
                    className="w-full rounded-lg border border-card-border bg-white dark:bg-card py-2.5 pl-10 pr-4 text-sm font-semibold transition-all focus:border-accent focus:outline-none text-primary dark:text-white"
                  />
                </div>

                {/* Passport & Nationality Row */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 z-10 text-muted">
                      <FileText className="h-4 w-4" />
                    </span>
                    <input
                      placeholder="Passport Number"
                      value={passenger.passport_no}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          'passport_no',
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-card-border bg-white dark:bg-card py-2.5 pl-10 pr-4 text-sm font-semibold transition-all focus:border-accent focus:outline-none text-primary dark:text-white"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-3.5 z-10 text-muted">
                      <Globe className="h-4 w-4" />
                    </span>
                    <input
                      placeholder="Nationality"
                      value={passenger.nationality}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          'nationality',
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-card-border bg-white dark:bg-card py-2.5 pl-10 pr-4 text-sm font-semibold transition-all focus:border-accent focus:outline-none text-primary dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Fare Summary */}
        <div className="border-t border-card-border pt-4 mt-6">
          <div className="flex flex-col rounded-xl bg-slate-50 dark:bg-background/50 border border-card-border p-4 gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted">
              <span>Seat Selection:</span>
              <span className="font-bold text-primary dark:text-white flex items-center gap-1">
                <Landmark className="h-3.5 w-3.5 text-accent" />
                {selectedSeatNumber ? `Seat ${selectedSeatNumber}` : 'None Selected'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs font-semibold text-muted">
              <span>Ticket Fare Base:</span>
              <span>₹{flight.base_price.toLocaleString('en-IN')} x {passengerCount}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-dashed border-card-border mt-1">
              <span className="text-sm font-bold text-primary dark:text-white">Total Amount:</span>
              <span className="text-xl font-black text-accent">
                ₹{(flight.base_price * passengerCount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Bank Level checkout badges */}
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <p className="text-xs font-bold text-primary dark:text-white">
              Bank-Grade Safe Encrypted Purchase
            </p>
            <p className="text-[10px] text-muted leading-relaxed">
              Your payments are handled using PCI-DSS level 1 security protocols. No full credit card details are logged on our servers.
            </p>
          </div>
        </div>

        {/* Booking Trigger CTA */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary dark:bg-accent dark:text-primary hover:bg-primary/95 dark:hover:bg-accent/90 text-white py-3.5 text-sm font-black tracking-wide shadow-md transition-all disabled:opacity-50 hover:scale-[1.01]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-primary border-t-transparent" />
              <span>Processing secure escrow...</span>
            </span>
          ) : (
            <span>Authorize & Confirm Secure Ticket</span>
          )}
        </button>

      </div>
    </div>
  )
}
