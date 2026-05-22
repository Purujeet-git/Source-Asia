import { create } from 'zustand'

type Passenger = {
  full_name: string
  passport_no: string
  nationality: string
}

type BookingStore = {

  selectedSeatId: string | null

  selectedSeatNumber: string | null

  selectedFlightId: string | null

  passengerCount: number

  passengers: Passenger[]

  setSelectedSeat: (
    seatId: string,
    seatNumber: string
  ) => void

  setSelectedFlight: (
    flightId: string
  ) => void

  setPassengerCount: (
    count: number
  ) => void

  setPassengers: (
    passengers: Passenger[]
  ) => void
}

export const useBookingStore =
  create<BookingStore>((set) => ({

    selectedSeatId: null,

    selectedSeatNumber: null,

    selectedFlightId: null,

    passengerCount: 1,

    passengers: [],

    setSelectedSeat: (
      seatId,
      seatNumber
    ) =>
      set({
        selectedSeatId: seatId,
        selectedSeatNumber: seatNumber,
      }),

    setSelectedFlight: (
      flightId
    ) =>
      set({
        selectedFlightId: flightId,
      }),

    setPassengerCount: (
      count
    ) =>
      set({
        passengerCount: count,
      }),

    setPassengers: (
      passengers
    ) =>
      set({
        passengers,
      }),
}))