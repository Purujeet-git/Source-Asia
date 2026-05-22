'use client'

import { Seat } from '@/types/seat'
import { DoorOpen, Plane, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useBookingStore } from '@/store/bookingStore'
import { gsap } from 'gsap'

type CabinClass = Seat['seat_class']

const cabinClassLabels: Record<CabinClass, string> = {
  first: 'First',
  business: 'Business',
  economy: 'Economy',
}

const cabinClassStyles: Record<CabinClass, string> = {
  first: 'border-amber-200 bg-amber-50/80 text-amber-950',
  business: 'border-sky-200 bg-sky-50/80 text-sky-950',
  economy: 'border-slate-200 bg-slate-50/80 text-slate-950',
}

export default function SeatMap({
  seats,
}: {
  seats: Seat[]
}) {
  const [liveSeats, setLiveSeats] = useState(seats)
  const { selectedSeatId, setSelectedSeat } = useBookingStore()

  useEffect(() => {
    const channel = supabase
      .channel('seats-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'seats',
        },
        (payload) => {
          const updatedSeat = payload.new as Seat

          setLiveSeats((currentSeats) =>
            currentSeats.map((seat) =>
              seat.id === updatedSeat.id
                ? updatedSeat
                : seat
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSeats((currentSeats) => [...currentSeats])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSeatClick = async (seat: Seat, elementId: string) => {
    if (!seat.is_available) {
      return
    }

    const isLocked =
      seat.locked_until &&
      new Date(seat.locked_until) > new Date()

    if (isLocked) {
      alert('Seat temporarily locked')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Please login first')
      return
    }

    const { data, error } = await supabase.rpc('lock_seat', {
      p_user_id: user.id,
      p_seat_id: seat.id,
    })

    if (error) {
      console.log(error)
      alert('Failed to lock seat')
      return
    }

    if (!data?.success) {
      alert(data?.message)
      return
    }

    // SUCCESS: select seat in store
    setSelectedSeat(seat.id, seat.seat_number)

    // Trigger elegant spring animation on selection
    const el = document.getElementById(elementId)
    if (el) {
      gsap.fromTo(el, 
        { scale: 0.8 }, 
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      )
    }
  }

  const groupedSeats = useMemo(() => {
    const rowsByClass: Record<CabinClass, Array<[string, Seat[]]>> = {
      first: [],
      business: [],
      economy: [],
    }

    const classBuckets: Record<CabinClass, Record<string, Seat[]>> = {
      first: {},
      business: {},
      economy: {},
    }

    liveSeats.forEach((seat) => {
      const row = seat.seat_number.slice(0, -1)

      if (!classBuckets[seat.seat_class][row]) {
        classBuckets[seat.seat_class][row] = []
      }

      classBuckets[seat.seat_class][row].push(seat)
    })

    Object.entries(classBuckets).forEach(([seatClass, rows]) => {
      rowsByClass[seatClass as CabinClass] = Object.entries(rows)
        .map(([row, rowSeats]) => [
          row,
          rowSeats.sort((a, b) =>
            a.seat_number.localeCompare(
              b.seat_number,
              undefined,
              { numeric: true }
            )
          ),
        ])
        .sort(([a], [b]) => Number(a) - Number(b)) as Array<[string, Seat[]]>
    })

    return rowsByClass
  }, [liveSeats])

  const renderSeat = (seat: Seat) => {
    const isLocked =
      !!seat.locked_until &&
      new Date(seat.locked_until) > new Date()

    const isSelected = selectedSeatId === seat.id

    const stateClass = !seat.is_available
      ? 'border-rose-300 bg-rose-100 text-rose-900 opacity-70'
      : isSelected
        ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-200'
        : isLocked
          ? 'border-amber-300 bg-amber-100 text-amber-950'
          : 'border-slate-300 bg-white text-slate-800 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-950'

    return (
      <button
        key={seat.id}
        id={`seat-${seat.id}`}
        title={`Seat: ${seat.seat_number}
Class: ${cabinClassLabels[seat.seat_class]}
Extra Fee: INR ${seat.extra_fee}`}
        onClick={() => handleSeatClick(seat, `seat-${seat.id}`)}
        disabled={!seat.is_available || (isLocked && !isSelected)}
        className={`group relative flex h-11 w-10 shrink-0 items-center justify-center rounded-b-lg rounded-t-2xl border text-xs font-bold transition-all ${stateClass}`}
      >
        <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-current opacity-35" />
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-current opacity-35" />
        {seat.seat_number}
      </button>
    )
  }

  const renderCabin = (seatClass: CabinClass) => {
    const rows = groupedSeats[seatClass]

    if (!rows.length) {
      return null
    }

    return (
      <section
        key={seatClass}
        className={`rounded-md border px-3 py-5 ${cabinClassStyles[seatClass]}`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">
              {cabinClassLabels[seatClass]} Cabin
            </h3>
            <p className="text-xs opacity-70">
              Rows {rows[0][0]}-{rows[rows.length - 1][0]}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium opacity-70">
            <DoorOpen className="h-4 w-4" />
            Exit
          </div>
        </div>

        <div className="space-y-2">
          {rows.map(([row, rowSeats]) => {
            const midpoint = Math.ceil(rowSeats.length / 2)
            const leftSeats = rowSeats.slice(0, midpoint)
            const rightSeats = rowSeats.slice(midpoint)

            return (
              <div
                key={row}
                className="grid grid-cols-[1.5rem_1fr_2.75rem_1fr_1.5rem] items-center gap-1.5 sm:grid-cols-[2rem_1fr_3.5rem_1fr_2rem] sm:gap-2"
              >
                <span className="text-center text-xs font-semibold text-slate-500">
                  {row}
                </span>

                <div className="flex justify-end gap-1.5">
                  {leftSeats.map(renderSeat)}
                </div>

                <div className="flex h-11 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white/70 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
                  Aisle
                </div>

                <div className="flex justify-start gap-1.5">
                  {rightSeats.map(renderSeat)}
                </div>

                <span className="text-center text-xs font-semibold text-slate-500">
                  {row}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xl">
      <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sky-700">
              <Plane className="h-4 w-4" />
              Aircraft seat map
            </div>
            <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
              Select your seat
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600 sm:grid-cols-4">
            <LegendItem className="border-slate-300 bg-white" label="Available" />
            <LegendItem className="border-amber-300 bg-amber-100" label="Held" />
            <LegendItem className="border-emerald-500 bg-emerald-500" label="Your seat" />
            <LegendItem className="border-rose-300 bg-rose-100" label="Booked" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-2 py-4 sm:px-6 sm:py-6">
        <div className="relative mx-auto min-w-[320px] max-w-190 sm:min-w-160">
          <div className="mx-auto h-24 w-[68%] rounded-t-[100%] border-x border-t border-slate-300 bg-linear-to-b from-white to-slate-100">
            <div className="mx-auto flex w-28 justify-center gap-2 pt-10">
              <span className="h-4 w-8 rounded-t-full bg-sky-200 shadow-inner" />
              <span className="h-4 w-8 rounded-t-full bg-sky-200 shadow-inner" />
            </div>
          </div>

          <div className="relative mx-auto border-x border-slate-300 bg-white px-3 py-5 shadow-[inset_16px_0_24px_rgba(148,163,184,0.16),inset_-16px_0_24px_rgba(148,163,184,0.16)] sm:px-7 sm:py-6">
            <div className="pointer-events-none absolute -left-20 top-[42%] hidden h-44 w-28 skew-y-12 rounded-l-[80%] bg-slate-200/80 sm:block md:-left-32 md:w-36" />
            <div className="pointer-events-none absolute -right-20 top-[42%] hidden h-44 w-28 -skew-y-12 rounded-r-[80%] bg-slate-200/80 sm:block md:-right-32 md:w-36" />

            <div className="mb-5 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                Cockpit
              </span>
              <span>Forward galley</span>
            </div>

            <div className="space-y-5">
              {renderCabin('first')}
              {renderCabin('business')}
              {renderCabin('economy')}
            </div>
          </div>

          <div className="mx-auto h-32 w-[58%] rounded-b-[100%] border-x border-b border-slate-300 bg-linear-to-b from-white to-slate-200">
            <div className="mx-auto h-20 w-28 rounded-b-[90%] border-x border-b border-slate-300 bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({
  className,
  label,
}: {
  className: string
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded-b-sm rounded-t-md border ${className}`} />
      <span>{label}</span>
    </div>
  )
}
