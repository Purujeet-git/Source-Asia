import FlightSearchForm from "@/components/flight/FlightSearchForm";
import FlightList from "@/components/flight/FlightList";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ShieldAlert, ShieldCheck, Lock } from "lucide-react";
import { Suspense } from "react";

export default async function FlightsPage({
    searchParams,
}: {
    searchParams: Promise<{
        origin?: string
        destination?: string
        date?:string
        passengers?:string
    }>
}) {
    const params = await searchParams

    const supabase = await createSupabaseServerClient()

    let query = supabase.from('flights').select('*')

    if (params.origin) {
        query = query.ilike('origin', `%${params.origin}%`)
    }

    if (params.destination) {
        query = query.ilike('destination', `%${params.destination}%`)
    }

    if (params.date) {
        query = query.gte(
            'departs_at',
            params.date
        )
    }

    const { data: flights } = await query

    return (
        <main className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Visual Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-card-border pb-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-primary dark:text-white">
                            Search Flight Fares
                        </h1>
                        <p className="text-sm text-muted">
                            Complete encryption. All available routes loaded with real-time seat lock verification.
                        </p>
                    </div>
                    
                    {/* Security trust badge */}
                    <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 rounded-xl text-success font-semibold text-xs shrink-0 self-start md:self-auto">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Encrypted Search Gateway</span>
                    </div>
                </div>

                {/* Search Widget */}
                <div className="shadow-lg rounded-2xl">
                    <Suspense fallback={
                        <div className="w-full bg-white dark:bg-card rounded-2xl p-6 shadow-md transition-all animate-pulse h-[200px]">
                          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                          <div className="grid gap-4 md:grid-cols-4 items-end">
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          </div>
                        </div>
                    }>
                        <FlightSearchForm />
                    </Suspense>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <span>Available Flights</span>
                            <span className="text-xs bg-primary/10 dark:bg-card-border px-2.5 py-0.5 rounded-full text-accent font-black">
                                {flights ? flights.length : 0} found
                            </span>
                        </h2>
                        
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                            <Lock className="h-3 w-3" />
                            <span>128-bit Secure Locks</span>
                        </div>
                    </div>

                    {flights && flights.length > 0 ? (
                        <FlightList flights={flights} />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-card-border bg-card">
                            <ShieldAlert className="h-10 w-10 text-amber-500 mb-3" />
                            <h3 className="text-base font-bold text-primary dark:text-white">No Flights Found</h3>
                            <p className="text-xs text-muted mt-1 max-w-sm">
                                We couldn't find matches for your search route. Try broadening your criteria or selecting another date.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}