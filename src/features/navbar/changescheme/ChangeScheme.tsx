import { MenuItem, Select, type SelectChangeEvent } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import { useSettingsStore } from 'store'
import { SchemeTypes } from 'models'
import styles from './ChangeScheme.module.css'

const getIcon = (id: string) => {
    switch (id) {
        case 'light':
            return <LightModeIcon />
        case 'dark':
            return <DarkModeIcon />
    }
}

export const ChangeScheme = () => {
    const { commonScheme, setCommonScheme } = useSettingsStore()

    const handleChange = (event: SelectChangeEvent) => {
        setCommonScheme(event.target.value)
    }

    return (
        <Select className={styles.select} value={commonScheme.id} onChange={handleChange}>
            {SchemeTypes.map(({ id }) => (
                <MenuItem value={id} key={id}>
                    {getIcon(id)}
                </MenuItem>
            ))}
        </Select>
    )
}
