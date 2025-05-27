import { useEffect, useRef } from 'react'

import { Box, TextField, Container, Paper, Typography, Avatar, IconButton, CircularProgress } from '@mui/material'

import SendIcon from '@mui/icons-material/Send'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'

import { useWebSocketService } from '../services'
import { useChatStore } from '../store'
import { ChatHeader, Suggestions, SystemMessage } from '../components'

export const ChatPage = () => {
    const { setSuggestions, messages, setMessages, isLoading, setIsLoading, setPinnedSuggestions, inputMessage, setInputMessage } =
        useChatStore()
    const { sendMessageWithType } = useWebSocketService()
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    // requestPinnedContext
/*     useEffect(() => {
        sendMessageWithType('get_all_context', 'get_all_context')
    }, [sendMessageWithType]) */

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Отправка сообщения
    const handleSendMessage = (e: { preventDefault: () => void }) => {
        e.preventDefault()
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <Box display="flex" flexDirection="column" className="content" sx={{ height: '90vh' }}>
            <Box flex={1} overflow="auto">
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Paper
                        className="suggestions-container"
                        elevation={3}
                        sx={{ p: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}
                    >
                        <ChatHeader />

                        <SystemMessage />

                        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, mb: 2 }}>
                            {messages.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        color: 'text.secondary',
                                    }}
                                >
                                    <Typography variant="body1">Начните диалог, отправив сообщение</Typography>
                                </Box>
                            ) : (
                                messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                                            mb: 2,
                                        }}
                                    >
                                        {message.type === 'bot' && (
                                            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                                                <SmartToyIcon />
                                            </Avatar>
                                        )}

                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                maxWidth: '70%',
                                                bgcolor: message.type === 'user' ? 'primary.light' : 'background.paper',
                                                color: message.type === 'user' ? 'white' : 'text.primary',
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            <Typography variant="body1">{message.content}</Typography>
                                        </Paper>

                                        {message.type === 'user' && (
                                            <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
                                                <PersonIcon />
                                            </Avatar>
                                        )}
                                    </Box>
                                ))
                            )}

                            {isLoading && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                                        <SmartToyIcon />
                                    </Avatar>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CircularProgress size={20} />
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            Происходит интеллектуальный поиск...
                                        </Typography>
                                    </Paper>
                                </Box>
                            )}

                            <div ref={messagesEndRef} />
                        </Box>

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
                                        variant="outlined"
                                        disabled={isLoading}
                                    />
                                    <Suggestions />
                                </Box>

                                <IconButton
                                    color="primary"
                                    type="submit"
                                    disabled={isLoading || !inputMessage.trim()}
                                    sx={{ ml: 1, width: 56, height: 56 }}
                                    onClick={handleSendMessage}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    )
}
