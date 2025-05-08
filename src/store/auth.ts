import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
    authTokens: string | null
    user: string | null
    initialized: boolean
}
type Action = {
    init: () => void
    setAuthTokens: (authTokens: string | null) => void
    setUser: (user: string | null) => void
}

const initialState: State = {
    authTokens: null,
    user: null,
    initialized: false,
}

export const useAuthStore = create(
    immer<State & Action>((set) => ({
        ...initialState,
        init: () => {
            set((state) => {
                const authTokens = localStorage.getItem('access')
                authTokens && (state.authTokens = authTokens)
                const user = localStorage.getItem('current_user')
                user && (state.user = user)
                state.initialized = true
            })
        },
        setAuthTokens: (authTokens) => {
            set((state) => (state.authTokens = authTokens))
        },
        setUser: (user) => {
            set((state) => (state.user = user))
        },
    })),
)
