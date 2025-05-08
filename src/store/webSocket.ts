import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { CHAT_API } from '../constants'

type SeverityLevels = 'error' | 'success'
type State = {
    severityLevel: SeverityLevels
    showSystemMessage: boolean
    systemMessage: string
    suggestions: string[]
    socketRef: WebSocket | null
    initialized: boolean
    reconnectTimeoutRef: NodeJS.Timer | null
}
type Action = {
    init: () => void
    setSeverityLevel: (severityLevel: SeverityLevels) => void
    setSystemMessage: (systemMessage: string) => void
    setShowSystemMessage: (showSystemMessage: boolean) => void
    setSuggestions: (suggestions: string[]) => void
}

const initialState: State = {
    severityLevel: 'error',
    showSystemMessage: false,
    systemMessage: '',
    suggestions: [],
    socketRef: null,
    initialized: false,
    reconnectTimeoutRef: null
}

export const useWebSocketStore = create(
    immer<State & Action>((set) => ({
        ...initialState,
        init: () => {
            set((state) => {
                state.socketRef = new WebSocket(CHAT_API),

                state.socketRef.onopen = () => {
                    console.log('WebSocket соединение установлено.')
                    state.severityLevel.current = 'success'
                    state.setSystemMessage('Установлено соединение с сервером')
                    state.setShowSystemMessage(true)

                    setTimeout(() => state.setShowSystemMessage(false), 5000)
                }

                state.socketRef.onclose = () => {
                    console.log('WebSocket соединение разорвано')
                    state.severityLevel.current = 'error'
                    state.setSystemMessage('Соединение с сервером разорвано. Попытка установки соединения...')
                    state.setShowSystemMessage(true)

                    state.reconnectTimeoutRef = setTimeout(()=>state.init(), 3000)
                }

                state.socketRef.onerror = (error: unknown) => {
                    console.error('WebSocket ошибка:', error)
                    state.setSystemMessage('Ошибка соединения с сервером.')
                    state.setShowSystemMessage(true)
                }
            })
        },
        setSeverityLevel: (severityLevel) => {
            set((state) => (state.severityLevel = severityLevel))
        },
        setSystemMessage: (systemMessage) => {
            set((state) => (state.systemMessage = systemMessage))
        },
        setShowSystemMessage: (showSystemMessage) => {
            set((state) => (state.showSystemMessage = showSystemMessage))
        },
        setSuggestions: (suggestions) => {
            set((state) => (state.suggestions = suggestions))
        },
    })),
)
