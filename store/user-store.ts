import { create } from 'zustand';

import { persist } from 'zustand/middleware';

type UserStore = {

    sessionToken:
    string | null

    cachedBookings: any[]

    setSessionToken: (
        token: string | null
    ) => void

    setCachedBookings: (
        bookings: any[]
    ) => void

    resetUserStore: () => void
}


export const useUserStore =
    create<UserStore>()(
        persist(
            (set) => ({
                sessionToken:
                    null,

                cachedBookings: [],

                setSessionToken: (
                    token
                ) =>
                    set({
                        sessionToken:
                            token,
                    }),

                setCachedBookings: (
                    bookings
                ) =>

                    set({
                        cachedBookings:
                            bookings,
                    }),

                resetUserStore: () =>

                    set({

                        sessionToken:
                            null,

                        cachedBookings:
                            [],
                    }),
            }),

            {
                name:
                    'user-store',

                partialize:
                    (state) => ({
                        sessionToken:
                            state.sessionToken,

                        cachedBookings:
                            state.cachedBookings,
                    }),
            }
        )
    )