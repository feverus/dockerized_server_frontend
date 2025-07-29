import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import {
    type SearchType,
    type GraphSearchType,
    type GraphSearchResponseType,
    type SchemeType,
    SchemeTypes,
    GraphSearchResponseTypes,
    SearchTypes,
    GraphSearchTypes,
} from '../models'

type State = {
    chatSearchType: SearchType
    chatGraphSearchType: GraphSearchType
    chatGraphSearchResponseType: GraphSearchResponseType
    commonScheme: SchemeType
}
type Action = {
    setСhatSearchType: (type: SearchType) => void
    setChatGraphSearchType: (type: GraphSearchType) => void
    setChatGraphSearchResponseType: (type: GraphSearchResponseType) => void
    setCommonScheme: (id: string) => void
}
const initialState: State = {
    chatSearchType: SearchTypes[2],
    chatGraphSearchType: GraphSearchTypes[2],
    chatGraphSearchResponseType: GraphSearchResponseTypes[0],
    commonScheme: SchemeTypes[0],
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
        setCommonScheme: (id: string) => {
            set((state) => {
                const scheme = SchemeTypes.find((scheme) => id === scheme.id)
                if (scheme) {
                    state.commonScheme = scheme
                }
            })
        },
    })),
)
