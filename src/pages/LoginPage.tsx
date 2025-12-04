import { useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import { Copyright, LoginForm, CanvasAtom, MainBarLogo } from 'features'
import { useWsStore } from 'store'
import styles from './LoginPage.module.css'

const defaultTheme = createTheme()

export const LoginPage = () => {
    const { setReconnectTimeout, reconnectTimeout, setWs } = useWsStore()

    useEffect(() => {
        reconnectTimeout && window.clearTimeout(reconnectTimeout)
        setReconnectTimeout(null)
        setWs(null)
    }, [reconnectTimeout, setReconnectTimeout, setWs])

    return (
        <ThemeProvider theme={defaultTheme}>
            <ReactNotifications className={'notificationContainer'} />
            <header className={styles.login_page_header}>
                <MainBarLogo />
            </header>
            <main>
                <CanvasAtom />
                <div className={styles.login_page_content}>
                    <p className={styles.login_page_title}>{import.meta.env.VITE_APP_NAME}</p>
                    <p className={styles.login_page_auth_title}>Авторизация</p>
                    <LoginForm />
                    <p id="version" className={styles.login_page_version}>
                        <Copyright />
                    </p>
                </div>
            </main>
        </ThemeProvider>
    )
}
