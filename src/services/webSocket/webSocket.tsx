import { useCallback } from 'react'
import _ from 'lodash'

import { useChatStore, useWsStore, type Suggestion } from '../../store'
import { useNotificationsService } from '../'

const CHAT_API = import.meta.env.VITE_CHAT_API

export const useWebSocketService = () => {
    const { setIsLoading, setSuggestions, setMessages, setPinnedSuggestions } = useChatStore()
    const { setWs } = useWsStore()
    const { addNotification } = useNotificationsService()

    const connect = () => {
        // Если соединение уже запущено, то ничего не делаем.
        if (useWsStore.getState().ws !== null) {
            return
        }
        const newWs = new WebSocket(CHAT_API)
        setWs(newWs)

        newWs.onopen = () => {
            addNotification({ type: 'success', message: 'Установлено соединение с сервером' })
            console.log('WebSocket соединение установлено.')
        }

        newWs.onclose = () => {
            addNotification({
                type: 'error',
                message: 'Соединение с сервером разорвано. Попытка установки соединения...',
            })
            console.log('WebSocket соединение разорвано')
            setWs(null)
            setTimeout(() => connect(), 1000)
        }

        newWs.onerror = (error: unknown) => {
            addNotification({
                type: 'error',
                message: 'Ошибка соединения с сервером' + error,
            })
            console.error('WebSocket ошибка:', error)
            newWs.close()
        }

        newWs.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data)
                console.log('🚀 onMessage:', response)
                switch (response.type) {
                    case 'local_search_chunk': {
                        setIsLoading(false)
                        const newMessages = [...useChatStore.getState().messages]
                        newMessages.push({
                            type: 'bot',
                            content: response.text + '\n',
                            isMarkdown: true,
                        })
                        setMessages(newMessages)
                        break
                    }
                    case 'global_search_chunk':
                    case 'chunk': {
                        setIsLoading(false)
                        const newMessages = [...useChatStore.getState().messages]
                        const lastMessage = newMessages.length > 0 ? newMessages[newMessages.length - 1] : null
                        if (lastMessage?.type === 'bot') {
                            newMessages[newMessages.length - 1] = {
                                ...lastMessage,
                                content: lastMessage.content + response.text,
                            }
                        } else {
                            newMessages.push({
                                type: 'bot',
                                content: response.text,
                            })
                        }
                        setMessages(newMessages)
                        break
                    }
                    case 'info': {
                        addNotification({
                            type: 'info',
                            message: response.text,
                        })
                        break
                    }
                    case 'get_all_context': {
                        setIsLoading(false)
                        break
                    }
                    case 'index': {
                        const extractedSuggestions = []
                        const a_text = response.text
                        for (const name in a_text) {
                            extractedSuggestions.push(a_text[name])
                        }
                        if (extractedSuggestions.length > 0) {
                            setSuggestions(extractedSuggestions)
                        }
                        break
                    }
                    case 'complete':
                        setIsLoading(false)
                        break
                    case 'error':
                        addNotification({
                            type: 'warning',
                            message: 'Ошибка: ' + response.text,
                        })
                        break
                    case 'pin_context': {
                        const pinnedSuggestions = useChatStore.getState().pinnedSuggestions
                        if (pinnedSuggestions.every((item) => !_.isEqual(item, response.text))) {
                            setPinnedSuggestions([...pinnedSuggestions, response.text])
                        }
                        break
                    }
                    case 'unpin_context': {
                        const pinnedSuggestions = useChatStore.getState().pinnedSuggestions
                        setPinnedSuggestions(pinnedSuggestions.filter((item) => !_.isEqual(item, response.text)))
                        break
                    }
                    // fixme Только для разработки, удалить на проде
                    case 'console':
                        console.log(response.text)
                        break
                    default:
                        break
                }
            } catch (error) {
                addNotification({
                    type: 'error',
                    message: 'Ошибка:' + error?.toString(),
                })
                console.error('Ошибка обработки сообщения с сервером по каналу WebSocket:', error)
                setIsLoading(false)
            }
        }
    }

    const sendJsonMessage = useCallback((message: unknown) => useWsStore.getState().ws?.send(JSON.stringify(message)), [])

    const sendMessageWithType = useCallback(
        (message: string | Suggestion, type = 'question') => {
            sendJsonMessage({
                type: type,
                message: message,
            })
        },
        [sendJsonMessage],
    )

    connect()

    return { sendMessageWithType }
}
