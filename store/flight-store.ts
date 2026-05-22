import { create }
from 'zustand'

import { persist }
from 'zustand/middleware'

type Passenger = {

  full_name: string

  nationality: string

  passport_no?: string
}

type FlightStore = {

  // SEARCH

  origin: string

  destination: string

  departureDate: string

  passengers: number

  // BOOKING

  selectedFlightId: string | null

  selectedSeatId: string | null

  selectedSeatNumber: string | null

  currentStep: number

  passengerForms: Passenger[]

  // ACTIONS

  setSearchQuery: (
    data: {
      origin: string
      destination: string
      departureDate: string
      passengers: number
    }
  ) => void

  setSelectedFlight: (
    flightId: string
  ) => void

  setSelectedSeat: (
    seatId: string,
    seatNumber: string
  ) => void

  setPassengerForms: (
    forms: Passenger[]
  ) => void

  setCurrentStep: (
    step: number
  ) => void

  resetStore: () => void
}

export const useFlightStore =
  create<FlightStore>()(

    persist(

      (set) => ({

        // INITIAL STATE

        origin: '',

        destination: '',

        departureDate: '',

        passengers: 1,

        selectedFlightId: null,

        selectedSeatId: null,

        selectedSeatNumber: null,

        currentStep: 1,

        passengerForms: [],

        // ACTIONS

        setSearchQuery: (
          data
        ) =>

          set({
            ...data,
          }),

        setSelectedFlight: (
          flightId
        ) =>

          set({
            selectedFlightId:
              flightId,
          }),

        setSelectedSeat: (
          seatId,
          seatNumber
        ) =>

          set({

            selectedSeatId:
              seatId,

            selectedSeatNumber:
              seatNumber,
          }),

        setPassengerForms: (
          forms
        ) =>

          set({
            passengerForms:
              forms,
          }),

        setCurrentStep: (
          step
        ) =>

          set({
            currentStep: step,
          }),

        resetStore: () =>

          set({

            origin: '',

            destination: '',

            departureDate: '',

            passengers: 1,

            selectedFlightId: null,

            selectedSeatId: null,

            selectedSeatNumber: null,

            currentStep: 1,

            passengerForms: [],
          }),
      }),

      {
        name:
          'flight-store',

        // IMPORTANT

        partialize:
          (state) => ({

            origin:
              state.origin,

            destination:
              state.destination,

            departureDate:
              state.departureDate,

            passengers:
              state.passengers,

            selectedFlightId:
              state.selectedFlightId,

            selectedSeatId:
              state.selectedSeatId,

            selectedSeatNumber:
              state.selectedSeatNumber,

            currentStep:
              state.currentStep,

            // EXCLUDE PASSPORTS

            passengerForms:
              state.passengerForms.map(
                (
                  passenger
                ) => ({

                  full_name:
                    passenger.full_name,

                  nationality:
                    passenger.nationality,
                })
              ),
          }),
      }
    )
  )