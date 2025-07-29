import { Paper, Box, Typography } from '@mui/material'

import { useChatStore } from '../../store'
import { Pin } from './Pin'
import { SuggestionsItem } from './suggestionsitem'
import styles from './Suggestions.module.css'

export const Suggestions = () => {
    const { suggestions, pinnedSuggestions } = useChatStore()
    console.log("🚀 ~ Suggestions ~ pinnedSuggestions:", pinnedSuggestions)
    console.log("🚀 ~ Suggestions ~ suggestions:", suggestions)
    const pinnedSuggestionsChunks = pinnedSuggestions.map(({ chunk_text }) => chunk_text)
    const notPinnedSuggestions = suggestions
                        .filter(({ chunk_text }) => !pinnedSuggestionsChunks.includes(chunk_text))

    if (suggestions.length === 0 && pinnedSuggestions.length === 0) {
        return
    }

    return (
        <Paper className={styles.wrapper} elevation={0}>
            {pinnedSuggestions.length > 0 && (
                <Box
                    className={styles.pinnedSuggestions}
                >
                    <Typography variant="caption" sx={{ display: 'block', mb: 1, }}>
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
                    {notPinnedSuggestions
                        .map((suggestion, index) => (
                            <SuggestionsItem key={index} needBorderBottom={index < notPinnedSuggestions.length - 1} suggestion={suggestion} />
                        ))}
                </Box>
            )}
        </Paper>
    )
}
