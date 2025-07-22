import { Box, Typography, IconButton } from '@mui/material'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'

import { type Suggestion } from '../../store'
import { useWebSocketService } from '../../services'

type SuggestionsItemProps = {
    needBorderBottom: boolean
    suggestion: Suggestion
}

export const SuggestionsItem = ({ needBorderBottom, suggestion }: SuggestionsItemProps) => {
    const { sendMessageWithType } = useWebSocketService()

    return (
        <Box
            sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                '&:hover': {
                    bgcolor: 'action.hover',
                    cursor: 'pointer',
                },
                borderBottom: needBorderBottom ? '1px solid #f0f0f0' : 'none',
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    flexGrow: 0,
                    '&:hover': { cursor: 'pointer' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '40vw',
                }}
            >
                {suggestion.chunk_text}
            </Typography>
            <IconButton size="small" onClick={() => sendMessageWithType(suggestion, 'pin_context')} sx={{ ml: 1 }}>
                <PushPinOutlinedIcon fontSize="small" />
            </IconButton>
        </Box>
    )
}
