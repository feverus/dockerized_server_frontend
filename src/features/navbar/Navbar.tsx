import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { Collapse, IconButton, styled, Toolbar, useScrollTrigger, useTheme } from '@mui/material'
import MuiList from '@mui/material/List'
import MenuIcon from '@mui/icons-material/Menu'
import MuiAppBar from '@mui/material/AppBar'

import { SubMenu } from '../submenu'
import { DRAWER_WIDTH } from '../../assets'
import { useMenuStore, useAuthStore } from '../../store'
import { useAuthService } from '../../services'
import { SidebarData } from '../../assets/SidebarData'
import { SystemMessage } from '../systemmessage'
import { Logout } from './logout'
import { ChangeScheme } from './changescheme'
import styles from './Navbar.module.css'

export const Navbar = () => {
    const theme = useTheme()
    const { isMenuOpened, setIsMenuOpened } = useMenuStore()
    const { user, authTokens } = useAuthStore()
    const { getUsername } = useAuthService()
    const [greeting, setGreeting] = React.useState('')

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window : undefined,
    })

    const menuСonditionalOptions = isMenuOpened
        ? {
              '@media (min-width: 1000px)': {
                  width: `calc(100% - ${DRAWER_WIDTH}px)`,
                  marginLeft: `${DRAWER_WIDTH}px`,
                  transition: theme.transitions.create(['margin', 'width'], {
                      easing: theme.transitions.easing.easeOut,
                      duration: theme.transitions.duration.enteringScreen,
                  }),
              },
          }
        : {}

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...menuСonditionalOptions,
    }))

    useEffect(() => {
        getUsername(authTokens).then((name) => setGreeting(name))
    }, [authTokens, getUsername, user])

    if (!user) {
        return null
    }

    return (
        <AppBar position="fixed" open={isMenuOpened} elevation={trigger ? 4 : 0} className={styles.wrapper}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => setIsMenuOpened(!isMenuOpened)}
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <SystemMessage />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {greeting}
                </Typography>
                <ChangeScheme />
                <Logout />
            </Toolbar>
            <Collapse in={isMenuOpened} timeout={2000} className={styles.sidebar}>
                <MuiList sx={{ overflow: 'auto', height: window.innerHeight - 48 }}>
                    {SidebarData.map((item, index) => {
                        return <SubMenu item={item} key={index} />
                    })}
                </MuiList>
            </Collapse>
        </AppBar>
    )
}
