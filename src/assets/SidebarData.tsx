import { type JSX } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import SearchIcon from '@mui/icons-material/Search'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ChatIcon from '@mui/icons-material/Chat'

export type SidebarDataItem =
    | {
          title: string
          path: string
          icon: JSX.Element
          id: string
          iconClosed?: undefined
          iconOpened?: undefined
          subNav?: undefined
      }
    | {
          title: string
          path: string
          icon: JSX.Element
          id: string
          iconClosed: JSX.Element
          iconOpened: JSX.Element
          subNav: SidebarDataItem[]
      }

export const SidebarData: SidebarDataItem[] = [
    {
        title: 'Общение с чат-ботом',
        path: '/chat',
        icon: <ChatIcon />,
        id: 'chat',
    },
    {
        title: 'Профиль',
        path: '/profile',
        icon: <HomeRoundedIcon />,
        id: 'profile',
    },
    {
        title: 'Мои задачи',
        path: '/tasks',
        icon: <FormatListBulletedRoundedIcon />,
        id: 'tasks',
    },
    {
        title: 'Поиск',
        path: '/search',
        // icon: <i className="bi bi-search"/>,
        icon: <SearchIcon />,
        id: 'search',
        // iconClosed: <i className="bi bi-arrow-down"/>,
        // iconOpened: <i className="bi bi-arrow-up"/>,
        iconClosed: <ArrowDownwardIcon />,
        iconOpened: <ArrowUpwardIcon />,

        subNav: [
            {
                title: 'Тест',
                path: '/profile/test',
                icon: <></>,
                id: 'test',
            },
        ],
    },
]
