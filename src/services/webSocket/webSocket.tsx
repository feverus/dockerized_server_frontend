import { useCallback, useRef } from 'react'
import _ from 'lodash'

import { useChatStore, useWsStore, type Suggestion } from 'store'
import { useNotificationsService } from '../'

const CHAT_API = import.meta.env.VITE_CHAT_API

export const useWebSocketService = () => {
    const { setIsLoading, setSuggestions, setMessages, setPinnedSuggestions, setSeverityLevel } = useChatStore()
    const { setWs, setReconnectTimeout, reconnectTimeout } = useWsStore()
    const { addNotification, removeNotification } = useNotificationsService()
    const idRetry = useRef<null | string>(null)

    const connect = useCallback(() => {
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
            if (!idRetry.current) {
                idRetry.current = addNotification({
                    type: 'error',
                    message: 'Соединение с сервером разорвано. Попытка установки соединения...',
                    autoHideDuration: 0,
                })
            }
            console.log('WebSocket соединение разорвано')
            setWs(null)
            !reconnectTimeout && setReconnectTimeout(setTimeout(() => connect(), 1000))
        }

        newWs.onerror = (error: unknown) => {
            if (!idRetry.current) {
                addNotification({
                    type: 'error',
                    message: 'Ошибка соединения с сервером',
                })
            }
            console.error('WebSocket ошибка:', error)
            newWs.close()
        }

        newWs.onmessage = (event) => {
            removeNotification(idRetry.current)
            idRetry.current = null
            try {
                const response = JSON.parse(event.data)
                const timestamp = new Date().getTime()
                switch (response.type) {
                    case 'local_search_chunk':
                    case 'global_search_chunk':
                    case 'chunk': {
                        if (!response.text.length) {
                            // Пропускаем пустые чанки
                            break
                        }
                        const newMessages = [...useChatStore.getState().messages]
                        const lastMessage = newMessages.length > 0 ? newMessages[newMessages.length - 1] : null
                        const sameTag = (lastMessage?.tag ?? '') === response.type
                        if (lastMessage?.type === 'bot' && sameTag) {
                            newMessages[newMessages.length - 1] = {
                                ...lastMessage,
                                content: lastMessage.content + response.text,
                                timestamp,
                                duration: newMessages[newMessages.length - 1].duration + timestamp - (lastMessage?.timestamp ?? 0),
                            }
                        } else {
                            newMessages.push({
                                type: 'bot',
                                content: response.text,
                                tag: response.type,
                                timestamp,
                                duration: timestamp - (lastMessage?.timestamp ?? 0),
                            })
                        }
                        setMessages(newMessages)
                        break
                    }
                    case 'info': {
                        if (response.text === 'Установлен тип поиска.') {
                            setIsLoading(false)
                        }
                        addNotification({
                            type: 'info',
                            message: response.text,
                        })
                        break
                    }
                    case 'get_all_context': {
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
                        setSeverityLevel('success')
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
    }, [
        addNotification,
        reconnectTimeout,
        removeNotification,
        setIsLoading,
        setMessages,
        setPinnedSuggestions,
        setReconnectTimeout,
        setSeverityLevel,
        setSuggestions,
        setWs,
    ])

    const sendJsonMessage = useCallback((message: unknown) => useWsStore.getState().ws?.send(JSON.stringify(message)), [])

    const sendMessageWithType = useCallback(
        (message: string | string[] | Suggestion, type = 'question') => {
            if (message === '') {
                return
            }
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
