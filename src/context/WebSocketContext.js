import React, {createContext, useContext, useEffect, useRef, useState} from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children}) => {
    const severityLevel = useRef("error")
    const [systemMessage, setSystemMessage] = useState('');
    const [showSystemMessage, setShowSystemMessage] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connectWebSocket = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        socketRef.current = new WebSocket('ws://localhost:80/ai/ws/chat');

        socketRef.current.onopen = () => {
            console.log('WebSocket соединение установлено.');
            severityLevel.current = "success"
            setSystemMessage('Установлено соединение с сервером');
            setShowSystemMessage(true);

            setTimeout(() => setShowSystemMessage(false), 5000);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket соединение разорвано');
            severityLevel.current = "error"
            setSystemMessage('Соединение с сервером разорвано. Попытка установки соединения...');
            setShowSystemMessage(true);

            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket ошибка:', error);
            setSystemMessage('Ошибка соединения с сервером.');
            setShowSystemMessage(true);
        };
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const sendMessage = (message, type = 'question') => {
        if (severityLevel.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            try {
                socketRef.current.send(JSON.stringify({
                    type: type,
                    message: message
                }));
                return true;
            } catch (error) {
                console.error('Произошла ошибка при отправке сообщения на сервер:', error);
                setSystemMessage('Произошла ошибка при отправке сообщения на сервер.');
                setShowSystemMessage(true);
                return false;
            }
        } else {
            setSystemMessage('Соединение с сервером разорвано. Попытка установки соединения...');
            setShowSystemMessage(true);
            connectWebSocket();
            return false;
        }
    };

    const registerMessageHandler = (callback) => {
        if (socketRef.current) {
            socketRef.current.onmessage = callback;
        }
    };

    return (
        <WebSocketContext.Provider
            value={{
                severityLevel,
                systemMessage,
                setSystemMessage,
                showSystemMessage,
                setShowSystemMessage,
                sendMessage,
                registerMessageHandler,
                suggestions,
                setSuggestions
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket должен использоваться внутри WebSocketProvider');
    }
    return context;
};