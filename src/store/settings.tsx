import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { SearchType, GraphSearchType, GraphSearchResponseType } from '../models'

type State = {
    chatSearchType: SearchType
    chatGraphSearchType: GraphSearchType
    chatGraphSearchResponseType: GraphSearchResponseType
}
type Action = {
    setСhatSearchType: (type: SearchType) => void
    setChatGraphSearchType: (type: GraphSearchType) => void
    setChatGraphSearchResponseType: (type: GraphSearchResponseType) => void
}
const initialState: State = {
    chatSearchType: { id: 'both', name: 'Оба' },
    chatGraphSearchType: { id: 'both', name: 'Оба' },
    chatGraphSearchResponseType: { id: 'Multiple Paragraphs', name: 'Несколько параграфов' },
}

export const useSettingsStore = create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    immer<State & Action>((set, get) => ({
        ...initialState,
        setСhatSearchType: (type: SearchType) => {
            set((state) => {
                state.chatSearchType = type
            })
        },
        setChatGraphSearchType: (type: GraphSearchType) => {
            set((state) => {
                state.chatGraphSearchType = type
            })
        },
        setChatGraphSearchResponseType: (type: GraphSearchResponseType) => {
            set((state) => {
                state.chatGraphSearchResponseType = type
            })
        },
    })),
)
