import { Paper, Box, Typography, Chip, IconButton } from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'

import { useWebSocketService } from '../../services'
import { useChatStore } from '../../store'

export const Suggestions = () => {
    const { sendMessageWithType } = useWebSocketService()
    const { suggestions, pinnedSuggestions } = useChatStore()

    return (
        (suggestions.length > 0 || pinnedSuggestions.length > 0) && (
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
                                    label={pinned.chunk_text}
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
                            .filter((suggestion) => !pinnedSuggestions.some((pinned) => pinned.chunk_text === suggestion.chunk_text))
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
                                        borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            flexGrow: 1,
                                            '&:hover': { cursor: 'pointer' },
                                        }}
                                    >
                                        {suggestion.chunk_text}
                                    </Typography>
                                    <IconButton size="small" onClick={() => sendMessageWithType(suggestion, 'pin_context')} sx={{ ml: 1 }}>
                                        <PushPinOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                    </Box>
                )}
            </Paper>
        )
    )
}
