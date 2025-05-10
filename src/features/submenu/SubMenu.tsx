import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Collapse, List } from '@mui/material'

import './SubMenu.css'
import type { SidebarDataItem } from '../../assets'

type SubMenuProps = {
    item: SidebarDataItem
}

export const SubMenu = ({ item }: SubMenuProps) => {
    const navigate = useNavigate()
    const location = useLocation().pathname.replaceAll('/', '')
    const [subnav, setSubnav] = useState(false)

    return (
        <>
            <ListItem
                key={item.title}
                disablePadding
                component={Link}
                to={item.path}
                onClick={() => item.subNav && setSubnav(!subnav)}
                id={item.id}
            >
                <ListItemButton selected={location === item.id} onClick={() => navigate(item.path)}>
                    <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItemButton>
                <div>{item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}</div>
            </ListItem>
            {subnav &&
                item.subNav?.map((item, index) => {
                    return (
                        <Collapse in={subnav} timeout="auto" unmountOnExit sx={{ pl: 4 }} key={index}>
                            <List component="div" disablePadding>
                                <ListItem
                                    key={item.title}
                                    disablePadding
                                    component={Link}
                                    to={item.path}
                                    onClick={() => item.subNav && setSubnav(!subnav)}
                                    id={item.id}
                                >
                                    <ListItemButton selected={location === item.id} onClick={() => navigate(item.path)}>
                                        <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.title} />
                                    </ListItemButton>
                                    <div>{item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}</div>
                                </ListItem>
                            </List>
                        </Collapse>
                    )
                })}
        </>
    )
}
