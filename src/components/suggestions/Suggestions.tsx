import { Paper, Box, Typography } from '@mui/material'

import { useChatStore } from '../../store'
import { Pin } from './Pin'
import { SuggestionsItem } from './SuggestionsItem'

export const Suggestions = () => {
    const { suggestions, pinnedSuggestions } = useChatStore()
    const pinnedSuggestionsChunks = pinnedSuggestions.map(({ chunk_text }) => chunk_text)

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
                                <Pin pinned={pinned} key={`pinned-${idx}`} />
                            ))}
                        </Box>
                    </Box>
                )}

                {suggestions.length > 0 && (
                    <Box>
                        {suggestions
                            .filter(({ chunk_text }) => !pinnedSuggestionsChunks.includes(chunk_text))
                            .map((suggestion, index) => (
                                <SuggestionsItem key={index} needBorderBottom={index < suggestions.length - 1} suggestion={suggestion} />
                            ))}
                    </Box>
                )}
            </Paper>
        )
    )
}
