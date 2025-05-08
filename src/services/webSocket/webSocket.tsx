import { useEffect } from 'react'

import { useWebSocketStore } from '../../store/webSocket'

export const useWebSocketService = () => {
    const { socketRef, severityLevel, initialized, reconnectTimeoutRef, init, setSystemMessage, setShowSystemMessage } = useWebSocketStore()

    useEffect(() => {
        if (!initialized) {
            init()
        }
        return () => {
            if (socketRef?.readyState === WebSocket.OPEN) {
                socketRef.close()
            }
            reconnectTimeoutRef && clearTimeout(reconnectTimeoutRef)
        }
    }, [init, initialized, reconnectTimeoutRef, socketRef])

    const sendMessage = (message: string, type = 'question') => {
        if (severityLevel === 'success' && socketRef?.readyState === WebSocket.OPEN) {
            try {
                socketRef.send(
                    JSON.stringify({
                        type: type,
                        message: message,
                    }),
                )
                return true
            } catch (error) {
                console.error('Произошла ошибка при отправке сообщения на сервер:', error)
                setSystemMessage('Произошла ошибка при отправке сообщения на сервер.')
                setShowSystemMessage(true)
                return false
            }
        } else {
            setSystemMessage('Соединение с сервером разорвано. Попытка установки соединения...')
            setShowSystemMessage(true)
            init()
            return false
        }
    }

    const registerMessageHandler = (callback: ((this: WebSocket, ev: MessageEvent) => void) | null) => {
        if (socketRef) {
            socketRef.onmessage = callback
        }
    }

    return {
        registerMessageHandler,
        sendMessage,
    }
}
