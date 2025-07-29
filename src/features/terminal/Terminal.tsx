import { useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Box, Typography, Avatar, Paper, CircularProgress } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'

import { useChatStore, type Message } from '../../store'
import { Tag } from './tag'
import { Timestamp } from './timestamp'
import { DaySeparator } from './dayseparator'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './Terminal.module.css'
import { formatFullTime } from '../../utils'

export const Terminal = () => {
    const { messages, isLoading } = useChatStore()
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const getMessage = (message: Message, index: number) => {
        return (
            <div key={index}>
                <DaySeparator messages={messages} index={index} />

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
                        elevation={0}
                        className={message.type === 'user' ? styles.user : styles.bot}
                        sx={{
                            pt: 1,
                            pb: 1,
                            pl: 2,
                            pr: 2,
                            maxWidth: '80%',
                        }}
                    >
                        {message.isMarkdown ? <ReactMarkdown>{message.content}</ReactMarkdown> : <Typography>{message.content}</Typography>}

                        {message.tag && <Tag tag={message.tag} />}

                        {message.type === 'bot' && message.duration > 1000 && <Tag tag={formatFullTime(message.duration)} />}

                        <Timestamp timestamp={message.timestamp} />
                    </Paper>

                    {message.type === 'user' && (
                        <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
                            <PersonIcon />
                        </Avatar>
                    )}
                </Box>
            </div>
        )
    }

    const getWelcome = () => {
        return (
            <Box className={styles.welcome}>
                <Typography variant="body1">Начните диалог, отправив сообщение</Typography>
            </Box>
        )
    }

    const getProgress = () => {
        return (
            <Box className={styles.progress}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                    <SmartToyIcon />
                </Avatar>
                <div className={styles.text}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        Происходит интеллектуальный поиск...
                    </Typography>
                </div>
            </Box>
        )
    }

    return (
        <Box className={styles.wrapper}>
            {messages.length === 0 ? getWelcome() : messages.map((message, index) => getMessage(message, index))}

            {isLoading && getProgress()}

            <div ref={messagesEndRef} />
        </Box>
    )
}
