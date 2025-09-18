import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'

import {
    type GraphSearchResponseIdType,
    type SchemeType,
    type GraphSearchIdType,
    SchemeTypes,
    GraphSearchResponseIds,
    GraphSearchIds,
} from '../models'

enableMapSet()

type GraphResponseModeType = Map<GraphSearchIdType, { id: GraphSearchResponseIdType; enabled: boolean }>

type State = {
    commonScheme: SchemeType
    isGraphEnabled: boolean
    graphResponseMode: GraphResponseModeType
    graphResponseModeCommonId: GraphSearchResponseIdType | undefined
}
type Action = {
    /**
     * Устанавливает цветовую схему
     */
    setCommonScheme: (id: string) => void
    /**
     * Включает графовый поиск
     */
    enableGraph: () => void
    /**
     * Отключает графовый поиск
     */
    disableGraph: () => void
    /**
     * Устанавливает тип ответа для типа поиска
     */
    setGraphResponseMode: (graphSearchId: GraphSearchIdType, responseId: GraphSearchResponseIdType) => void
    /**
     * Устанавливает один общий тип ответа для типа поиска
     */
    setCommonGraphResponseMode: (responseId: GraphSearchResponseIdType) => void
    /**
     * Включает тип поиска
     */
    enableGraphResponse: (graphSearchId: GraphSearchIdType) => void
    /**
     * Отключает тип поиска
     */
    disableGraphResponse: (graphSearchId: GraphSearchIdType) => void
    /**
     * Включает все типы поиска
     */
    enableAllGraphResponse: () => void
    /**
     * Отключает все типы поиска
     */
    disableAllGraphResponse: () => void
    /**
     * Возвращает массив включенных типов поиска
     */
    getEnabledGraphSearchIds: () => GraphSearchIdType[]
}

/**
 * Если выбраны одинаковые типы ответа, то возвращает общий id, иначе null
 */
const getCommonId = (map: GraphResponseModeType) => {
    if (map.size === 0) {
        return
    }
    const id = map.values().next().value?.id
    if (!id) {
        return
    }
    for (const value of map.values()) {
        if (!value || value.id !== id) {
            return
        }
    }
    return id
}

const getInitialGraphResponseMode = () => new Map(GraphSearchIds.map((id) => [id, { id: GraphSearchResponseIds[0], enabled: false }]))

const initialState: State = {
    isGraphEnabled: false,
    graphResponseMode: getInitialGraphResponseMode(),
    commonScheme: SchemeTypes[0],
    graphResponseModeCommonId: undefined,
}

export const useSettingsStore = create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    immer<State & Action>((set, get) => ({
        ...initialState,
        setCommonScheme: (id: string) => {
            set((state) => {
                const scheme = SchemeTypes.find((scheme) => id === scheme.id)
                if (scheme) {
                    state.commonScheme = scheme
                }
            })
        },
        enableGraph: () => {
            set((state) => {
                state.isGraphEnabled = true
            })
        },
        disableGraph: () => {
            set((state) => {
                state.isGraphEnabled = false
            })
        },
        setGraphResponseMode: (graphSearchId, responseId) => {
            set((state) => {
                const value = state.graphResponseMode.get(graphSearchId)
                state.graphResponseMode.set(graphSearchId, { enabled: true, ...value, id: responseId })
                state.graphResponseModeCommonId = getCommonId(state.graphResponseMode)
            })
        },
        setCommonGraphResponseMode: (responseId) => {
            set((state) => {
                GraphSearchIds.forEach((key) => {
                    const value = state.graphResponseMode.get(key)
                    state.graphResponseMode.set(key, { enabled: true, ...value, id: responseId })
                })
                state.graphResponseModeCommonId = responseId
            })
        },
        enableGraphResponse: (graphSearchId: GraphSearchIdType) => {
            set((state) => {
                const value = state.graphResponseMode.get(graphSearchId)
                state.graphResponseMode.set(graphSearchId, { id: GraphSearchResponseIds[0], ...value, enabled: true })
            })
        },
        disableGraphResponse: (graphSearchId: GraphSearchIdType) => {
            set((state) => {
                const value = state.graphResponseMode.get(graphSearchId)
                state.graphResponseMode.set(graphSearchId, { id: GraphSearchResponseIds[0], ...value, enabled: false })
            })
        },
        enableAllGraphResponse: () => {
            set((state) => {
                GraphSearchIds.forEach((key) => {
                    const value = state.graphResponseMode.get(key)
                    state.graphResponseMode.set(key, { id: GraphSearchResponseIds[0], ...value, enabled: true })
                })
            })
        },
        disableAllGraphResponse: () => {
            set((state) => {
                GraphSearchIds.forEach((key) => {
                    const value = state.graphResponseMode.get(key)
                    state.graphResponseMode.set(key, { id: GraphSearchResponseIds[0], ...value, enabled: false })
                })
            })
        },
        getEnabledGraphSearchIds: () =>
            Array.from(get().graphResponseMode.entries())
                .filter(([, value]) => value.enabled)
                .map(([key]) => key),
    })),
)
