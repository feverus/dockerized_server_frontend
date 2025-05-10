import useWebSocket from 'react-use-websocket'

import { useChatStore } from '../../store'
import { CHAT_API } from '../../assets'

export const useWebSocketService = () => {
    const { setSystemMessage, setShowSystemMessage, setSeverityLevel } = useChatStore()

    const { sendJsonMessage, getWebSocket } = useWebSocket(CHAT_API, {
        onOpen: () => {
            console.log('WebSocket соединение установлено.')
            setSeverityLevel('success')
            setSystemMessage('Установлено соединение с сервером')
            setShowSystemMessage(true)
        },
        onClose: () => {
            console.log('WebSocket соединение разорвано')
            setSeverityLevel('error')
            setSystemMessage('Соединение с сервером разорвано. Попытка установки соединения...')
            setShowSystemMessage(true, true)
        },
        shouldReconnect: (closeEvent) => {
            console.log('💨closeEvent', closeEvent)
            return true
        },
        onError: (error: unknown) => {
            console.error('WebSocket ошибка:', error)
            setSystemMessage('Ошибка соединения с сервером.')
            setShowSystemMessage(true, true)
        },
        reconnectInterval: 3000,
    })

    const sendMessageWithType = (message: string, type = 'question') => {
        sendJsonMessage({
            type: type,
            message: message,
        })
    }

    const registerMessageHandler = (callback: ((this: WebSocket, ev: MessageEvent) => void) | null) => {
        const ws = getWebSocket()
        if (ws) {
            ws.onmessage = callback
        }
    }

    return {
        registerMessageHandler,
        sendMessageWithType,
    }
}
