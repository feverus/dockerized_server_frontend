import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'

import { DrawerHeader } from './components'
import { Navbar, Sidebar } from './features'
import { LoginPage, ChatPage } from './pages'
import { useAuthStore } from './store'
import { themeLight, themeDark } from './themes'
import { PrivateRoute } from './utils'
import './App.css'

export default function App() {
    const user = useAuthStore((state) => state.user)
    const light = true //const [light, setLight] = useState(false)

    return (
        <ThemeProvider theme={light ? themeLight : themeDark}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Sidebar />
                <main>
                    {user && <DrawerHeader />}
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
        </ThemeProvider>
    )
}
