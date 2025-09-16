import { Chip } from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin'

import { useWebSocketService } from 'services'
import type { Suggestion } from 'store'

type PinProps = {
    pinned: Suggestion
}

export const Pin = ({ pinned }: PinProps) => {
    const { sendMessageWithType } = useWebSocketService()

    return (
        <Chip
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
    )
}
