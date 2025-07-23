import { Paper } from '@mui/material'

import { ChatHeader, ChatInput, Suggestions, Terminal } from '../features'
import styles from './ChatPage.module.css'

export const ChatPage = () => {
    return (
        <div className={styles.wrapper}>
            <Paper className={styles.half}>
                <Suggestions />
            </Paper>
            <Paper className={styles.half}>
                <ChatHeader />
                <Terminal />
                <ChatInput />
            </Paper>
        </div>
    )
}
