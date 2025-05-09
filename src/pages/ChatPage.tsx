import { useEffect, useRef, type FormEvent } from 'react'

import { Box, TextField, Container, Paper, Typography, Avatar, IconButton, CircularProgress, Alert, Collapse, Chip } from '@mui/material'

import SendIcon from '@mui/icons-material/Send'
import PersonIcon from '@mui/icons-material/Person'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CloseIcon from '@mui/icons-material/Close'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'

import { useWebSocketService } from '../services'
import { useChatStore } from '../store'

export const ChatPage = () => {
    const {
        setSeverityLevel,
        severityLevel,
        systemMessage,
        setSystemMessage,
        showSystemMessage,
        setShowSystemMessage,
        suggestions,
        setSuggestions,
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        pinnedSuggestions,
        setPinnedSuggestions,
        inputMessage,
        setInputMessage,
    } = useChatStore()
    const { sendMessageWithType, registerMessageHandler } = useWebSocketService()
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    // requestPinnedContext
    useEffect(() => {
        sendMessageWithType('get_all_context', 'get_all_context')
    }, [sendMessageWithType])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Регистрация обработчика сообщений
    useEffect(() => {
        registerMessageHandler((event) => {
            try {
                const response = JSON.parse(event.data)
                switch (response.type) {
                    case 'index': {
                        const extractedSuggestions = []
                        console.log('🚀 ~ registerMessageHandler ~ response.text:', response.text)
                        const a_text = response.text
                        for (const name in a_text) {
                            extractedSuggestions.push(a_text[name])
                        }
                        if (extractedSuggestions.length > 0) {
                            setSuggestions(extractedSuggestions)
                        }
                        break
                    }
                    case 'chunk': {
                        setIsLoading(false)
                        const newMessages = [...messages]
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
                    case 'complete':
                        setIsLoading(false)
                        break
                    case 'error':
                        setIsLoading(false)
                        setSeverityLevel('warning')
                        setSystemMessage('Ошибка: ' + response.text)
                        setShowSystemMessage(true, true)
                        break
                    case 'pin_context':
                        if (!pinnedSuggestions.includes(response.text)) {
                            setPinnedSuggestions([...pinnedSuggestions, response.text])
                        }
                        setPinnedSuggestions(pinnedSuggestions)
                        break
                    case 'unpin_context':
                        setPinnedSuggestions(pinnedSuggestions.filter((s) => s !== response.text))
                        break
                    // fixme Только для разработки, удалить на проде
                    case 'console':
                        console.log(response.text)
                        break
                    default:
                        break
                }
            } catch (error) {
                console.error('Ошибка обработки сообщения с сервером по каналу WebSocket:', error)
                setIsLoading(false)
                setSeverityLevel('error')
                setSystemMessage('Ошибка:' + error?.toString())
                setShowSystemMessage(true, true)
            }
        })
    }, [
        messages,
        pinnedSuggestions,
        registerMessageHandler,
        setIsLoading,
        setMessages,
        setPinnedSuggestions,
        setSeverityLevel,
        setShowSystemMessage,
        setSuggestions,
        setSystemMessage,
        severityLevel,
    ])

    // Отправка сообщения
    const handleSendMessage = (e: FormEvent<HTMLDivElement>) => {
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

    const clearChatHistory = () => {
        setMessages([])
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h4" component="h1">
                                {`СПЖЦ "Персонал". СИИП "Помощник".`}
                            </Typography>
                            <IconButton color="error" onClick={clearChatHistory} title="Очистить историю чата" size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Collapse in={showSystemMessage}>
                            <Alert
                                severity={severityLevel}
                                action={
                                    <IconButton size="small" onClick={() => setShowSystemMessage(false)}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                }
                                sx={{
                                    mb: 2,
                                    zIndex: 1000,
                                    position: 'relative',
                                }}
                            >
                                {systemMessage}
                            </Alert>
                        </Collapse>

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

                        <Box component="form" sx={{ mt: 'auto' }}>
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
                                        onSubmit={handleSendMessage}
                                        variant="outlined"
                                        disabled={isLoading}
                                    />

                                    {(suggestions.length > 0 || pinnedSuggestions.length > 0) && (
                                        <Paper
                                            sx={{
                                                position: 'absolute',
                                                width: '100%',
                                                zIndex: 1500,
                                                mt: 0.5,
                                                maxHeight: '200px',
                                                overflow: 'auto',
                                            }}
                                            elevation={3}
                                        >
                                            {pinnedSuggestions.length > 0 && (
                                                <Box
                                                    sx={{
                                                        p: 1,
                                                        borderBottom: '1px solid #e0e0e0',
                                                        bgcolor: 'rgba(66, 165, 245, 0.1)',
                                                    }}
                                                >
                                                    <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                                                        Закрепленный контекст
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {pinnedSuggestions.map((pinned, idx) => (
                                                            <Chip
                                                                key={`pinned-${idx}`}
                                                                label={pinned}
                                                                size="small"
                                                                icon={<PushPinIcon fontSize="small" />}
                                                                onDelete={() => sendMessageWithType(pinned, 'unpin_context')}
                                                                sx={{
                                                                    maxWidth: '100%',
                                                                    '& .MuiChip-label': {
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                    },
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {suggestions.length > 0 && (
                                                <Box>
                                                    {suggestions
                                                        .filter((suggestion) => !pinnedSuggestions.some((pinned) => pinned === suggestion))
                                                        .map((suggestion, index) => (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    p: 1,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    '&:hover': {
                                                                        bgcolor: 'action.hover',
                                                                        cursor: 'pointer',
                                                                    },
                                                                    borderBottom:
                                                                        index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        flexGrow: 1,
                                                                        '&:hover': { cursor: 'pointer' },
                                                                    }}
                                                                >
                                                                    {suggestion}
                                                                </Typography>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => sendMessageWithType(suggestion, 'pin_context')}
                                                                    sx={{ ml: 1 }}
                                                                >
                                                                    <PushPinOutlinedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                </Box>
                                            )}
                                        </Paper>
                                    )}
                                </Box>

                                <IconButton
                                    color="primary"
                                    type="submit"
                                    disabled={isLoading || !inputMessage.trim()}
                                    sx={{ ml: 1, width: 56, height: 56 }}
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
