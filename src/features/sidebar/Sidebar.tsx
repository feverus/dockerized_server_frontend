import MuiList from '@mui/material/List'
import { Drawer, Divider, IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import { SubMenu } from '../submenu'
import { useAuthStore, useMenuStore } from 'store'
import { DRAWER_WIDTH, SidebarData } from 'assets'
import styles from './Sidebar.module.css'

export const Sidebar = () => {
    const { user } = useAuthStore()
    const { isMenuOpened, setIsMenuOpened } = useMenuStore()

    if (!user) {
        return null
    }

    return (
        <Drawer
            sx={{
                width: DRAWER_WIDTH,
                '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
            }}
            variant="persistent"
            anchor="left"
            open={isMenuOpened}
            className={styles.wrapper}
        >
            <div className={styles.drawerHeader}>
                <IconButton onClick={() => setIsMenuOpened(!isMenuOpened)} sx={{ color: 'white' }}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider sx={{ background: 'white' }} />
            <MuiList>
                {SidebarData.map((item, index) => (
                    <SubMenu item={item} key={index} />
                ))}
            </MuiList>
        </Drawer>
    )
}
