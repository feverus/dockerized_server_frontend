import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
    user: string | null
    initialized: boolean
}
type Action = {
    setUser: (user: string | null) => void
    setInitialized: (initialized: boolean) => void
}

const initialState: State = {
    user: null,
    initialized: false,
}

export const useAuthStore = create(
    immer<State & Action>((set) => ({
        ...initialState,
        setUser: (user) => {
            set((state) => {
                state.user = user
            })
        },
        setInitialized: (initialized) => {
            set((state) => {
                state.initialized = initialized
            })
        },
    })),
)
