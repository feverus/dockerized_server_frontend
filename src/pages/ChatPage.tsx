import { Paper } from '@mui/material'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import { ChatHeader, ChatInput, SearchSettings, Suggestions, Terminal } from '../features'
import styles from './ChatPage.module.css'

export const ChatPage = () => {
    return (
        <div className={styles.wrapper}>
            <ReactNotifications className={'notificationContainer'} />
            <Paper className={styles.half}>
                <Suggestions />
                <SearchSettings />
            </Paper>
            <Paper className={styles.half}>
                <ChatHeader />
                <Terminal />
                <ChatInput />
            </Paper>
        </div>
    )
}
