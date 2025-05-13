import { Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useChatStore } from '../../store'

export const ChatHeader = () => {
    const { setMessages } = useChatStore()
    const clearChatHistory = () => {
        setMessages([])
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
                {`СПЖЦ "Персонал". СИИП "Помощник".`}
            </Typography>
            <IconButton color="error" onClick={clearChatHistory} title="Очистить историю чата" size="small">
                <CloseIcon />
            </IconButton>
        </Box>
    )
}
