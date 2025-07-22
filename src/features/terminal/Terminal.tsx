import { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Box, Typography, Avatar, Paper, CircularProgress } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'

import { useChatStore } from '../../store'

export const Terminal = () => {
    const { messages, isLoading } = useChatStore()
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    // requestPinnedContext
    /*     useEffect(() => {
            sendMessageWithType('get_all_context', 'get_all_context')
        }, [sendMessageWithType]) */

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
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
                            {message.isMarkdown ? (
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            ) : (
                                <Typography>{message.content}</Typography>
                            )}
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
    )
}
