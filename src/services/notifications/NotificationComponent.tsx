import type { MouseEvent } from 'react'
import classNames from 'classnames'
import { Box, Button } from '@mui/material'

import type { NotificationComponentProps } from './notifications.types'
import styles from './NotificationComponent.module.css'

export function NotificationComponent({ id, type, message, onClose }: NotificationComponentProps) {
    function handleClose(evt: MouseEvent) {
        evt.stopPropagation()
        onClose?.(id)
    }

    return (
        <Box className={classNames(styles.wrapper, styles[type])}>
            <Box className={styles.header}>
                <Box className={styles.text}>{message}</Box>
                <Button className={styles.closeBtn} onClick={handleClose}>
                    &#10005;
                </Button>
            </Box>
        </Box>
    )
}
