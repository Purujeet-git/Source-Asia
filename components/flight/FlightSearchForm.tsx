'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useBookingStore } from '@/store/bookingStore'
import { MapPin, Calendar, Users, Search, ArrowRightLeft } from 'lucide-react'

export default function FlightSearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [origin, setOrigin] = useState(searchParams.get('origin') || '')
  const [destination, setDestination] = useState(searchParams.get('destination') || '')
  const [date, setDate] = useState(searchParams.get('date') || '')
  const [passengers, setPassengers] = useState(Number(searchParams.get('passengers')) || 1)

  const setPPassengerCount = useBookingStore(
    (state) => state.setPassengerCount
  )

  useEffect(() => {
    // If passengers param is changed in URL, sync it
    const pCount = Number(searchParams.get('passengers'))
    if (pCount && pCount > 0) {
      setPPassengerCount(pCount)
    }
  }, [searchParams, setPPassengerCount])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (origin) params.set('origin', origin)
    if (destination) params.set('destination', destination)
    if (date) params.set('date', date)
    params.set('passengers', passengers.toString())

    router.push(`/flights?${params.toString()}`)
  }

  const swapRoute = () => {
    const temp = origin
    setOrigin(destination)
    setDestination(temp)
  }

  return (
    <div className="w-full bg-white dark:bg-card rounded-2xl p-6 shadow-md transition-all">
      <div className="grid gap-4 md:grid-cols-4 items-end">
        {/* Origin Input */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
            <MapPin className="h-3 w-3 text-accent" />
            <span>From</span>
          </label>
          <div className="relative">
            <input
              placeholder="Delhi, Mumbai, etc."
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-background/40 py-3.5 pl-4 pr-10 text-sm font-semibold transition-all focus:border-accent focus:bg-white dark:focus:bg-card focus:outline-none text-primary dark:text-white"
            />
          </div>
          
          {/* Swap Button (floating helper) */}
          <button 
            onClick={swapRoute}
            type="button"
            className="absolute -right-2 top-[35px] z-10 hidden md:flex h-7 w-7 items-center justify-center rounded-full border border-card-border bg-card hover:bg-slate-100 dark:hover:bg-background text-muted hover:text-accent shadow-sm transition-all"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Destination Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
            <MapPin className="h-3 w-3 text-accent" />
            <span>To (Destination)</span>
          </label>
          <input
            placeholder="London, New York, Paris..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-background/40 py-3.5 px-4 text-sm font-semibold transition-all focus:border-accent focus:bg-white dark:focus:bg-card focus:outline-none text-primary dark:text-white"
          />
        </div>

        {/* Departure Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
            <Calendar className="h-3 w-3 text-accent" />
            <span>Departure Date</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-card-border bg-slate-50/50 dark:bg-background/40 py-3 px-4 text-sm font-semibold transition-all focus:border-accent focus:bg-white dark:focus:bg-card focus:outline-none text-primary dark:text-white"
          />
        </div>

        {/* Passenger count */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1">
            <Users className="h-3 w-3 text-accent" />
            <span>Passengers</span>
          </label>
          <div className="flex items-center border border-card-border bg-slate-50/50 dark:bg-background/40 rounded-xl px-2">
            <input
              type="number"
              min={1}
              max={9}
              value={passengers}
              onChange={(e) => {
                const count = Math.max(1, Number(e.target.value))
                setPassengers(count)
                setPPassengerCount(count)
              }}
              className="w-full bg-transparent py-3.5 px-2 text-sm font-semibold transition-all focus:outline-none text-primary dark:text-white"
            />
            <span className="text-xs font-bold text-muted pr-2">PAX</span>
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-card-border pt-4">
        <p className="text-xs text-muted flex items-center gap-1">
          <span>⚡ Lock seats instantly with 0% extra holding fees</span>
        </p>
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary dark:bg-accent hover:bg-primary/95 dark:hover:bg-accent/90 text-white dark:text-primary font-bold text-sm px-8 py-3.5 shadow-md shadow-primary/10 dark:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto shrink-0"
        >
          <Search className="h-4 w-4" />
          <span>Search Flights</span>
        </button>
      </div>
    </div>
  )
}