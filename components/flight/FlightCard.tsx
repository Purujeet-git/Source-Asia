import Link from 'next/link'
import { Flight } from '@/types/flight'
import { Plane, Calendar, ShieldCheck, Armchair } from 'lucide-react'

export default function FlightCard({
  flight,
}: {
  flight: Flight
}) {
  const departure = new Date(flight.departs_at)
  const arrival = new Date(flight.arrives_at)

  const durationMs = arrival.getTime() - departure.getTime()
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  const formattedDate = departure.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const departsTime = departure.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const arrivesTime = arrival.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return (
    <div className="group rounded-2xl bg-white dark:bg-card border border-card-border p-6 shadow-sm hover:shadow-lg dark:hover:shadow-black/25 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Route Details */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-card-border px-3 py-1 text-xs font-bold text-muted uppercase tracking-wider">
              <Plane className="h-3.5 w-3.5 -rotate-45 text-accent" />
              {flight.flight_no}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            {/* Origin */}
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-primary dark:text-white">
                {departsTime}
              </span>
              <span className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                {flight.origin}
              </span>
            </div>

            {/* Flight path line */}
            <div className="flex-1 flex flex-col items-center px-4 relative max-w-[200px]">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                {hours}h {minutes}m
              </span>
              <div className="w-full h-[2px] bg-slate-200 dark:bg-card-border relative flex items-center justify-center">
                <Plane className="absolute h-4.5 w-4.5 text-accent rotate-95 bg-white dark:bg-card px-0.5 transition-transform group-hover:translate-x-3 duration-500" />
              </div>
              <span className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Non-stop
              </span>
            </div>

            {/* Destination */}
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-primary dark:text-white">
                {arrivesTime}
              </span>
              <span className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                {flight.destination}
              </span>
            </div>
          </div>
        </div>

        {/* Aircraft and Classes info */}
        <div className="flex flex-col gap-2 border-t lg:border-t-0 lg:border-x border-card-border pt-4 lg:pt-0 lg:px-8 max-w-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider">
            <span>Aircraft:</span>
            <span className="text-primary dark:text-white">{flight.aircraft_type}</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              <Armchair className="h-3 w-3" />
              Economy
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 dark:border-sky-900/50 bg-sky-50 dark:bg-sky-950/20 px-2 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
              <Armchair className="h-3 w-3" />
              Business
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              <Armchair className="h-3 w-3" />
              First
            </span>
          </div>
        </div>

        {/* Booking and Price actions */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4 border-t lg:border-t-0 border-card-border pt-4 lg:pt-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Secure Fare</span>
            <span className="text-2xl font-black text-primary dark:text-white">
              ₹{flight.base_price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            <Link
              href={`/flights/${flight.id}`}
              className="flex h-11 items-center justify-center rounded-xl bg-primary dark:bg-accent dark:text-primary hover:bg-primary/95 hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-sm px-6 shadow-sm transition-all whitespace-nowrap"
            >
              Book Seat
            </Link>
            <span className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-success">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>SSL Secured Checkout</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}