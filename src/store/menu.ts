import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
    isMenuOpened: boolean
}
type Action = {
    setIsMenuOpened: (open: boolean) => void
}

const initialState: State = {
    isMenuOpened: false,
}

export const useMenuStore = create(
    immer<State & Action>((set) => ({
        ...initialState,
        setIsMenuOpened: (isMenuOpened) => {
            set((state) => {
                state.isMenuOpened = isMenuOpened
            })
        },
    })),
)
