import MuiList from '@mui/material/List'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { styled, Drawer, Divider, IconButton, useTheme } from '@mui/material'

import 'bootstrap-icons/font/bootstrap-icons.css'
import { SubMenu } from '../submenu'
import { useAuthStore, useMenuStore } from '../../store'
import { DRAWER_WIDTH, SidebarData } from '../../assets'
import { DrawerHeader } from '../../components'
import styles from './Sidebar.module.css'

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

export const Sidebar = () => {
    const { user } = useAuthStore()
    const { isMenuOpened, setIsMenuOpened } = useMenuStore()
    const theme = useTheme()

    if (!user) {
        return null
    }
    return (
        <Drawer
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', backgroundColor: '#212529', color: 'white' },
            }}
            variant="persistent"
            anchor="left"
            open={isMenuOpened}
            className={styles.wrapper}
        >
            <DrawerHeader>
                <IconButton onClick={() => setIsMenuOpened(!isMenuOpened)} sx={{ color: 'white' }}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider sx={{ background: 'white' }} />
            <List>
                {SidebarData.map((item, index) => (
                    <SubMenu item={item} key={index} />
                ))}
            </List>
        </Drawer>
    )
}
