import { Paper } from '@mui/material'
import Split from 'react-split'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import { ChatHeader, ChatInput, SearchSettings, Suggestions, Terminal } from '../features'
import styles from './ChatPage.module.css'

export const ChatPage = () => {
    return (
        <>
            <ReactNotifications className={'notificationContainer'} />
            <Split direction="horizontal" sizes={[50, 50]} className={styles.wrapper} minSize={[200, 500]} snapOffset={10}>
                <Paper className={styles.half}>
                    <Suggestions />
                </Paper>
                <Paper className={styles.half}>
                    <ChatHeader />
                    <Terminal />
                    <SearchSettings />
                    <ChatInput />
                </Paper>
            </Split>
        </>
    )
}
