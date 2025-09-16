import classNames from 'classnames'
import { Box, IconButton } from '@mui/material'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'

import { type Suggestion } from 'store'
import { useWebSocketService } from 'services'
import styles from './SuggestionsItem.module.css'

type SuggestionsItemProps = {
    needBorderBottom: boolean
    suggestion: Suggestion
}

export const SuggestionsItem = ({ needBorderBottom, suggestion }: SuggestionsItemProps) => {
    const { sendMessageWithType } = useWebSocketService()

    return (
        <Box
            className={classNames(styles.wrapper, { [styles.borderBottom]: needBorderBottom })}
            onClick={() => sendMessageWithType(suggestion, 'pin_context')}
        >
            <p className={styles.text}>{suggestion.chunk_text}</p>
            <IconButton size="small" sx={{ ml: 1 }} disabled>
                <PushPinOutlinedIcon fontSize="small" />
            </IconButton>
        </Box>
    )
}
