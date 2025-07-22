import { Paper } from '@mui/material'

import { SystemMessage } from '../components'
import { ChatHeader, ChatInput, Suggestions, Terminal } from '../features'
import styles from './ChatPage.module.css'

export const ChatPage = () => {
    return (
        <>
            <div className={styles.wrapper}>
                <Paper className={styles.half}>
                    <ChatHeader />
                    <Terminal />
                    <ChatInput />
                </Paper>
                <Paper className={styles.half}>
                    <Suggestions />
                </Paper>
            </div>
            <SystemMessage />
        </>
    )
}
