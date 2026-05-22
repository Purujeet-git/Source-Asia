export type Seat = {

  id: string

  flight_id: string

  seat_number: string

  seat_class:
    | 'economy'
    | 'business'
    | 'first'

  is_available: boolean

  extra_fee: number

  locked_by: string | null

  locked_until: string | null
}