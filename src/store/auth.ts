import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
    authTokens: string | null
    user: string | null
    initialized: boolean
}
type Action = {
    setAuthTokens: (authTokens: string | null) => void
    setUser: (user: string | null) => void
    setInitialized: (initialized: boolean) => void
}

const initialState: State = {
    authTokens: null,
    user: null,
    initialized: false,
}

export const useAuthStore = create(
    immer<State & Action>((set) => ({
        ...initialState,
        setAuthTokens: (authTokens) => {
            set((state) => (state.authTokens = authTokens))
        },
        setUser: (user) => {
            set((state) => (state.user = user))
        },
        setInitialized: (initialized) => {
            set((state) => (state.initialized = initialized))
        },
    })),
)
