'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import FlightCard from './FlightCard'
import { Flight } from '@/types/flight'

export default function FlightList({
  flights,
}: {
  flights: Flight[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (flights.length > 0 && containerRef.current) {
      // Clear any prior gsap timeline transforms to avoid layout jumps
      gsap.killTweensOf(containerRef.current.children)
      
      gsap.fromTo(
        containerRef.current.children, 
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.06, 
          ease: 'power2.out',
          clearProps: 'transform'
        }
      )
    }
  }, [flights])

  return (
    <div ref={containerRef} className="space-y-4">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  )
}