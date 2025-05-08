import React, {useContext, useEffect, useState, useRef} from 'react';

import {styled} from "@mui/material";
import {
    Box,
    TextField,
    Container,
    Paper,
    Typography,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
    Collapse,
    Chip
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

import { useAuthService } from "../services";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const SquaredItem = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    aspectRatio: "1/1",
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const ChatPage = () => {
    const {authTokens, logoutUser} = useAuthService();
    const [profile, setProfile] = useState([]);
    const {
        severityLevel,
        systemMessage,
        setSystemMessage,
        showSystemMessage,
        setShowSystemMessage,
        sendMessage,
        registerMessageHandler,
        suggestions,
        setSuggestions
    } = useContext()
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const CHAT_STORAGE_KEY = 'chat_messages';
    const CHAT_INPUT_STORAGE_KEY = 'chat_input_message';
    const PINNED_SUGGESTIONS_KEY = 'pinned_suggestions';

    const [pinnedSuggestions, setPinnedSuggestions] = useState([]);
    const requestPinnedContext = () => {
        sendMessage("get_all_context", "get_all_context");
    };
    useEffect(() => {
        requestPinnedContext();
    }, []);

    const [inputMessage, setInputMessage] = useState(() => {
        return localStorage.getItem(CHAT_INPUT_STORAGE_KEY) || '';
    });

    useEffect(() => {
        localStorage.setItem(CHAT_INPUT_STORAGE_KEY, inputMessage);
    }, [inputMessage]);

    useEffect(() => {
        localStorage.setItem(PINNED_SUGGESTIONS_KEY, JSON.stringify(pinnedSuggestions));
    }, [pinnedSuggestions]);

    // URL API for data
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    const url = params.profile !== null
        ? `http://localhost:80/api/profile/get_profile/?profile=${params.profile}`
        : 'http://localhost:80/api/profile/get_profile/';

    useEffect(() => {
        loadSavedMessages();
    }, []);

    const loadSavedMessages = () => {
        try {
            const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
        } catch (error) {
            console.error('Ошибка загрузки сообщений:', error);
        }
    };

    // fixme Временно решение, перевести хранение истории в БД
    useEffect(() => {
        if (messages.length > 0) {
            try {
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
            } catch (error) {
                console.error('Ошибка сохранения истории чата:', error);
            }
        }
    }, [messages]);

    async function getData() {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens)
                }
            });
            let data = ""

            try {
                data = await response.json();
            } catch (e) {
                data = await response;
            }

            if (response.status === 200) {
                setProfile(data);
            } else if (response.statusText === 'Unauthorized') {
                logoutUser();
            }
        } catch (error) {
            console.error("Ошибка загрузки профиля:", error);
            severityLevel.current = "warning"
            setSystemMessage("Произошла ошибка загрузки профиля");
            setShowSystemMessage(true);
            setTimeout(() => setShowSystemMessage(false), 5000);
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        localStorage.setItem(CHAT_INPUT_STORAGE_KEY, inputMessage);
    }, [inputMessage]);

    // Регистрация обработчика сообщений
    useEffect(() => {
        registerMessageHandler((event) => {
            try {
                const response = JSON.parse(event.data);
                switch (response.type) {
                    case "index":
                        const extractedSuggestions = [];
                        const a_text = response.text
                        for (let name in a_text) {
                            extractedSuggestions.push(a_text[name]);
                        }
                        if (extractedSuggestions.length > 0) {
                            setSuggestions(extractedSuggestions);
                        }
                        break;
                    case "chunk":
                        setIsLoading(false);

                        setMessages(prev => {
                            const newMessages = [...prev];
                            const lastMessage = newMessages.length > 0 ? newMessages[newMessages.length - 1] : null;

                            if (lastMessage && lastMessage.type === 'bot') {
                                newMessages[newMessages.length - 1] = {
                                    ...lastMessage,
                                    content: lastMessage.content + response.text
                                };
                            } else {
                                newMessages.push({
                                    type: 'bot',
                                    content: response.text
                                });
                            }
                            return newMessages;
                        });
                        break
                    case "complete":
                        setIsLoading(false);
                        break;
                    // fixme Только для разработки, удалить на проде
                    case "console":
                        console.log(response.text)
                        break;
                    case "error":
                        setIsLoading(false);
                        severityLevel.current = "warning"
                        setSystemMessage('Ошибка: ' + response.text);
                        setShowSystemMessage(true);
                        setTimeout(() => setShowSystemMessage(false), 5000);
                        break;
                    case "pin_context":
                        setPinnedSuggestions(prevPinned => {
                            if (!prevPinned.includes(response.text)) {
                                return [...prevPinned, response.text];
                            }
                            return prevPinned;
                        });
                        break;
                    case "unpin_context":
                        setPinnedSuggestions(prevPinned =>
                            prevPinned.filter(s => s.chunk_text !== response.text.chunk_text)
                        );
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error('Ошибка обработки сообщения с сервером по каналу WebSocket:', error);
                setIsLoading(false);
                severityLevel.current = "error"
                setSystemMessage('Ошибка:' + error.toString());
                setShowSystemMessage(true);
                setTimeout(() => setShowSystemMessage(false), 5000);
            }
        });
    }, [registerMessageHandler]);

    // Отправка сообщения
    const handleSendMessage = (e) => {
        e.preventDefault();
        setSuggestions([]);
        setPinnedSuggestions([])

        if (!inputMessage.trim()) return;

        setIsLoading(true);

        setMessages(prev => [...prev, {
            type: 'user',
            content: inputMessage
        }]);

        localStorage.removeItem(CHAT_INPUT_STORAGE_KEY);
        setInputMessage('');

        const success = sendMessage(inputMessage);
        if (!success) {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const clearChatHistory = () => {
        setMessages([]);
        localStorage.removeItem(CHAT_STORAGE_KEY);
    };

    useEffect(() => {
        const handleSuggestionsOutside = (event) => {
            const suggestionsContainer = document.querySelector('.suggestions-container');
            if (suggestionsContainer && !suggestionsContainer.contains(event.target)) {
                setSuggestions([]);
            }
        };

        if (suggestions.length > 0) {
            document.addEventListener('mousedown', handleSuggestionsOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleSuggestionsOutside);
        };
    }, [suggestions.length]);

    return (
        <Box display="flex" flexDirection="column" className="content" sx={{height: '90vh'}}>
            <Box flex={1} overflow="auto">
                <Container maxWidth="md" sx={{mt: 4, mb: 4}}>
                    <Paper className="suggestions-container" elevation={3} sx={{p: 2, height: '60vh', display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h4" component="h1">
                                СПЖЦ "Персонал". СИИП "Помощник".
                            </Typography>
                            <IconButton
                                color="error"
                                onClick={clearChatHistory}
                                title="Очистить историю чата"
                                size="small"
                            >
                                <CloseIcon/>
                            </IconButton>
                        </Box>

                        <Collapse in={showSystemMessage}>
                            <Alert
                                severity={severityLevel.current}
                                action={
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowSystemMessage(false)}
                                    >
                                        <CloseIcon fontSize="small"/>
                                    </IconButton>
                                }
                                sx={{
                                    mb: 2,
                                    zIndex: 1000,
                                    position: 'relative'
                                }}
                            >
                                {systemMessage}
                            </Alert>
                        </Collapse>

                        <Box sx={{flexGrow: 1, overflow: 'auto', p: 2, mb: 2}}>
                            {messages.length === 0 ? (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    color: 'text.secondary'
                                }}>
                                    <Typography variant="body1">
                                        Начните диалог, отправив сообщение
                                    </Typography>
                                </Box>
                            ) : (
                                messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                                            mb: 2
                                        }}
                                    >
                                        {message.type === 'bot' && (
                                            <Avatar sx={{bgcolor: 'primary.main', mr: 1}}>
                                                <SmartToyIcon/>
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
                                                whiteSpace: 'pre-wrap'
                                            }}
                                        >
                                            <Typography variant="body1">{message.content}</Typography>
                                        </Paper>

                                        {message.type === 'user' && (
                                            <Avatar sx={{bgcolor: 'secondary.main', ml: 1}}>
                                                <PersonIcon/>
                                            </Avatar>
                                        )}
                                    </Box>
                                ))
                            )}

                            {isLoading && (
                                <Box sx={{display: 'flex', justifyContent: 'flex-start', mb: 2}}>
                                    <Avatar sx={{bgcolor: 'primary.main', mr: 1}}>
                                        <SmartToyIcon/>
                                    </Avatar>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <CircularProgress size={20}/>
                                        <Typography variant="body2" sx={{ml: 1}}>Происходит интеллектуальный поиск...</Typography>
                                    </Paper>
                                </Box>
                            )}

                            <div ref={messagesEndRef}/>
                        </Box>

                        <Box component="form" onSubmit={handleSendMessage} sx={{mt: 'auto'}}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Box sx={{position: 'relative', flexGrow: 1}}>
                                    <TextField
                                        fullWidth
                                        placeholder="Введите ваше сообщение..."
                                        value={inputMessage}
                                        onChange={(e) => {
                                            setInputMessage(e.target.value);
                                            sendMessage(e.target.value, 'index');
                                        }}
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
                                                overflow: 'auto'
                                            }}
                                            elevation={3}
                                        >
                                            {pinnedSuggestions.length > 0 && (
                                                <Box sx={{
                                                    p: 1,
                                                    borderBottom: '1px solid #e0e0e0',
                                                    bgcolor: 'rgba(66, 165, 245, 0.1)'
                                                }}>
                                                    <Typography variant="caption"
                                                                sx={{display: 'block', mb: 1, color: 'text.secondary'}}>
                                                        Закрепленный контекст
                                                    </Typography>
                                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                                        {pinnedSuggestions.map((pinned, idx) => (
                                                            <Chip
                                                                key={`pinned-${idx}`}
                                                                label={pinned.chunk_text}
                                                                size="small"
                                                                icon={<PushPinIcon fontSize="small"/>}
                                                                onDelete={() => sendMessage(pinned, "unpin_context")}
                                                                sx={{
                                                                    maxWidth: '100%',
                                                                    '& .MuiChip-label': {
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis'
                                                                    }
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {suggestions.length > 0 && (
                                                <Box>
                                                    {suggestions
                                                        .filter(suggestion => !pinnedSuggestions.some(
                                                            pinned => pinned.chunk_text === suggestion.chunk_text
                                                        ))
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
                                                                        cursor: 'pointer'
                                                                    },
                                                                    borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        flexGrow: 1,
                                                                        '&:hover': {cursor: 'pointer'}
                                                                    }}
                                                                >
                                                                    {suggestion.chunk_text}
                                                                </Typography>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => sendMessage(suggestion, "pin_context")}
                                                                    sx={{ml: 1}}
                                                                >
                                                                    <PushPinOutlinedIcon fontSize="small"/>
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
                                    sx={{ml: 1, width: 56, height: 56}}
                                >
                                    <SendIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default ChatPage;