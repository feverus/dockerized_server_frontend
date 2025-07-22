import { Box, TextField, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

import { useWebSocketService } from '../../services'
import { useChatStore } from '../../store'

export const ChatInput = () => {
    const { setSuggestions, messages, setMessages, isLoading, setIsLoading, setPinnedSuggestions, inputMessage, setInputMessage } =
        useChatStore()
    const { sendMessageWithType } = useWebSocketService()

    const sendMessage = () => {
        setSuggestions([])
        setPinnedSuggestions([])
        if (!inputMessage.trim()) {
            return
        }
        setIsLoading(true)
        setMessages([...messages, { type: 'user', content: inputMessage }])
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
        <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', flexGrow: 1 }}>
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
                        disabled={isLoading}
                    />
                </Box>

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
        </Box>
    )
}
