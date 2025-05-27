import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
    ws: null | WebSocket
}
type Action = {
    setWs: (ws: null | WebSocket) => void
}

const initialState: State = {
    ws: null,
}

export const useWsStore = create(
    immer<State & Action>((set) => ({
        ...initialState,
        setWs: (ws) => {
            set((state) => {
                state.ws = ws
            })
        },
    })),
)
