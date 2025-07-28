import { Box, TextField, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

import { useWebSocketService } from '../../services'
import { useChatStore } from '../../store'
import styles from './ChatInput.module.css'

export const ChatInput = () => {
    const {
        setSuggestions,
        messages,
        setMessages,
        isLoading,
        isSettingsOpened,
        setIsLoading,
        setPinnedSuggestions,
        inputMessage,
        setInputMessage,
    } = useChatStore()
    const { sendMessageWithType } = useWebSocketService()

    const sendMessage = () => {
        setSuggestions([])
        setPinnedSuggestions([])
        if (!inputMessage.trim()) {
            return
        }
        setIsLoading(true)
        setMessages([
            ...messages,
            {
                type: 'user',
                content: inputMessage,
                timestamp: new Date().getTime(),
                duration: 0,
            },
        ])
        setInputMessage('')
        sendMessageWithType(inputMessage)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                fullWidth
                placeholder="Введите ваше сообщение..."
                value={inputMessage}
                onChange={(e) => {
                    setInputMessage(e.target.value)
                    sendMessageWithType(e.target.value, 'index')
                }}
                onKeyDown={handleInputKeyDown}
                variant="outlined"
                disabled={isLoading || isSettingsOpened}
                className={styles.inputWrapper}
            />

            <IconButton
                color="primary"
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                sx={{ ml: 1, width: 56, height: 56 }}
                onClick={sendMessage}
            >
                <SendIcon />
            </IconButton>
        </Box>
    )
}
