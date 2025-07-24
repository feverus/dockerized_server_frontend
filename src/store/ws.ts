import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
    ws: null | WebSocket
    reconnectTimeout: null | NodeJS.Timeout
}
type Action = {
    setWs: (value: null | WebSocket) => void
    setReconnectTimeout: (value: null | NodeJS.Timeout) => void
}

const initialState: State = {
    ws: null,
    reconnectTimeout: null,
}

export const useWsStore = create(
    immer<State & Action>((set) => ({
        ...initialState,
        setWs: (value) => {
            set((state) => {
                state.ws = value
            })
        },
        setReconnectTimeout: (value) => {
            set((state) => {
                state.reconnectTimeout = value
            })
        },
    })),
)
