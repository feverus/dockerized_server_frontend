import { Collapse, Alert, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useChatStore } from '../../store'

export const SystemMessage = () => {
    const { severityLevel, systemMessage, showSystemMessage, setShowSystemMessage } = useChatStore()

    return (
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
    )
}
