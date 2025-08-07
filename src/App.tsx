import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'

import { Navbar, Sidebar } from './features'
import { LoginPage, ChatPage } from './pages'
import { useAuthStore, useChatStore, useSettingsStore } from './store'
import { getCommonSettings, getInputMessage, getSavedMessages, PrivateRoute, saveCommonSettings } from './utils'
import { SchemeTypes } from './models'
import { useAuthService } from './services'
import './App.css'

export default function App() {
    const [init, setInit] = useState(false)
    const user = useAuthStore((state) => state.user)
    const { setMessages, setInputMessage } = useChatStore()
    const { commonScheme, setCommonScheme } = useSettingsStore()
    const { getUsername } = useAuthService()

    // Инициализация из хранилища браузера
    useEffect(() => {
        if (init) {
            return
        }
        getUsername(useAuthStore.getState().authTokens).then((name) => useAuthStore.getState().setUser(name))
        setMessages(getSavedMessages())
        setInputMessage(getInputMessage())
        const settings = getCommonSettings()
        setCommonScheme(settings.commonScheme.id)
        setInit(true)
    }, [getUsername, init, setCommonScheme, setInputMessage, setMessages])

    // Переключение темы
    useEffect(() => {
        if (!init) {
            return
        }
        SchemeTypes.forEach(({ id }) => {
            document.body.classList.remove(id)
        })
        document.body.classList.add(commonScheme.id)
        saveCommonSettings()
    }, [commonScheme, init])

    if (!init) {
        return
    }
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Navbar />
            <Sidebar />
            <main>
                <Routes>
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/chat" element={<ChatPage />} />
                    </Route>
                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/schedule" element={<ChatPage />} />
                    </Route>
                    {/*<Route exact path='/register' element={<Register/>}/>*/}
                    <Route path="/login" element={user ? <Navigate to="/chat" replace /> : <LoginPage />} />
                    <Route path="*" element={<Navigate to="/chat" replace />} />
                </Routes>
            </main>
        </Box>
    )
}
