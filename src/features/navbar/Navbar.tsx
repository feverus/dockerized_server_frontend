import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { Collapse, IconButton, styled, Toolbar, useScrollTrigger, useTheme } from '@mui/material'
import MuiList from '@mui/material/List'
import MenuIcon from '@mui/icons-material/Menu'
import MuiAppBar from '@mui/material/AppBar'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { SubMenu } from '../submenu'
import { DRAWER_WIDTH } from '../../assets'
import { useMenuStore, useAuthStore } from '../../store'
import { useAuthService } from '../../services'
import { SidebarData } from '../../assets/SidebarData'
import { SystemMessage } from '../systemmessage'
import styles from './Navbar.module.css'

// Black theme
const List = styled(MuiList)({
    // selected и (selected + hover)
    '&& .Mui-selected, && .Mui-selected:hover': {
        backgroundColor: 'blue',
        '&, & .MuiListItemIcon-root': {
            color: 'white',
        },
    },
    // hover
    '& .MuiListItemButton-root:hover': {
        backgroundColor: '#632ce4',
        '&, & .MuiListItemIcon-root': {
            color: 'white',
        },
    },
})

export const Navbar = () => {
    const theme = useTheme()
    const { isMenuOpened, setIsMenuOpened } = useMenuStore()
    const { user, authTokens } = useAuthStore()
    const { logoutUser, getUsername } = useAuthService()
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
        <AppBar position="fixed" open={isMenuOpened} sx={{ backgroundColor: '#212529' }} elevation={trigger ? 4 : 0}>
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
                <IconButton color="inherit" aria-label="logout" onClick={logoutUser} edge="end">
                    <ExitToAppIcon />
                </IconButton>
            </Toolbar>
            <Collapse in={isMenuOpened} timeout={2000} className={styles.wrapper}>
                <List sx={{ overflow: 'auto', height: window.innerHeight - 48 }}>
                    {SidebarData.map((item, index) => {
                        return <SubMenu item={item} key={index} />
                    })}
                </List>
            </Collapse>
        </AppBar>
    )
}
