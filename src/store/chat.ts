import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { CHAT_INPUT_STORAGE_KEY, CHAT_STORAGE_KEY, PINNED_SUGGESTIONS_KEY } from '../assets'

type SeverityLevels = 'error' | 'success' | 'warning' | 'info'
export type Suggestion = {
    chunk_text: string
    page: number
    similarity_score: bigint
    source: string
}
type Message = {
    type: string
    content: string
    isMarkdown?: boolean
}
type State = {
    severityLevel: SeverityLevels
    showSystemMessage: boolean
    isLoading: boolean
    systemMessage: string
    inputMessage: string
    suggestions: Suggestion[]
    messages: Message[]
    pinnedSuggestions: Suggestion[]
}
type Action = {
    setSeverityLevel: (severityLevel: SeverityLevels) => void
    setSystemMessage: (systemMessage: string) => void
    setShowSystemMessage: (showSystemMessage: boolean, keep?: boolean) => void
    setInputMessage: (inputMessage: string) => void
    setIsLoading: (isLoading: boolean) => void
    setSuggestions: (suggestions: Suggestion[]) => void
    setMessages: (messages: Message[]) => void
    setPinnedSuggestions: (pinnedSuggestions: Suggestion[]) => void
}

const loadSavedMessages = () => {
    try {
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY)
        if (savedMessages) {
            return JSON.parse(savedMessages)
        }
        return []
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error)
        return []
    }
}

const initialState: State = {
    severityLevel: 'error',
    showSystemMessage: false,
    isLoading: false,
    systemMessage: '',
    inputMessage: localStorage.getItem(CHAT_INPUT_STORAGE_KEY) || '',
    suggestions: [],
    messages: loadSavedMessages(),
    pinnedSuggestions: [],
}

export const useChatStore = create(
    immer<State & Action>((set, get) => ({
        ...initialState,
        setSeverityLevel: (severityLevel) => {
            set((state) => {
                state.severityLevel = severityLevel
            })
        },
        setSystemMessage: (systemMessage) => {
            set((state) => {
                state.systemMessage = systemMessage
            })
        },
        setShowSystemMessage: (showSystemMessage, keep = false) => {
            set((state) => {
                state.showSystemMessage = showSystemMessage
            })
            if (showSystemMessage && !keep) {
                setTimeout(() => get().setShowSystemMessage(false), 5000)
            }
        },
        setSuggestions: (suggestions) => {
            set((state) => {
                state.suggestions = suggestions
            })
        },
        setMessages: (messages) => {
            if (!messages.length) {
                localStorage.removeItem(CHAT_STORAGE_KEY)
            } else {
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
            }
            set((state) => {
                state.messages = messages
            })
        },
        setIsLoading: (isLoading) => {
            set((state) => {
                state.isLoading = isLoading
            })
        },
        setPinnedSuggestions: (pinnedSuggestions) => {
            localStorage.setItem(PINNED_SUGGESTIONS_KEY, JSON.stringify(pinnedSuggestions))
            set((state) => {
                state.pinnedSuggestions = pinnedSuggestions
            })
        },
        setInputMessage: (inputMessage) => {
            if (inputMessage === '') {
                localStorage.removeItem(CHAT_INPUT_STORAGE_KEY)
            } else {
                localStorage.setItem(CHAT_INPUT_STORAGE_KEY, JSON.stringify(inputMessage))
            }
            set((state) => {
                state.inputMessage = inputMessage
            })
        },
    })),
)
