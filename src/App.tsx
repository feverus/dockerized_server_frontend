import { Routes, Route, Navigate } from 'react-router-dom'
import { styled, useTheme, Box, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'

import { DrawerHeader } from './components'
import { Navbar, Sidebar } from './features'
import { LoginPage, ChatPage } from './pages'
import { useAuthStore, useMenuStore } from './store'
import { themeLight, themeDark } from './themes'
import { PrivateRoute } from './utils'
import { DRAWER_WIDTH } from './assets'
import './App.css'

export default function App() {
    const { user } = useAuthStore()
    const { isMenuOpened } = useMenuStore()
    const theme = useTheme()
    const light = false //const [light, setLight] = useState(false)

    const menuСonditionalOptions = isMenuOpened
        ? {
              transition: theme.transitions.create('margin', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
              }),
              marginLeft: `-${DRAWER_WIDTH}px`,
              '@media (min-width: 1000px)': {
                  marginLeft: 0,
              },
              ...(!user && {
                  marginLeft: 0,
              }),
          }
        : {
              transition: theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
              }),
              marginLeft: 0,
          }

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
        flexGrow: 1,
        padding: theme.spacing(0),
        ...menuСonditionalOptions,
    }))

    return (
        <ThemeProvider theme={light ? themeLight : themeDark}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <Sidebar />
                <Main>
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
                </Main>
            </Box>
        </ThemeProvider>
    )
}
