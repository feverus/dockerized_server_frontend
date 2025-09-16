import { useState } from 'react'
import cn from 'classnames'
import { IconButton, Paper } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useChatStore, useSettingsStore } from 'store'
import { GraphSearch, GraphSearchIds, GraphSearchResponse } from 'models'
import { SearchSettingsHead, SearchSettingsRow } from './SearchSettingsRow'
import { SearchSettingsSwitch } from './SearchSettingsSwitch'
import styles from './SearchSettings.module.css'

export const SearchSettings = () => {
    const [open, setOpen] = useState(false)
    const { isGraphEnabled, graphResponseMode } = useSettingsStore()
    const setIsSettingsOpened = useChatStore((state) => state.setIsSettingsOpened)

    const changeOpen = () => {
        setIsSettingsOpened(!useChatStore.getState().isSettingsOpened)
        setOpen(!open)
    }

    const getSearchTypeStatus = () => (isGraphEnabled ? 'Векторный + Графовый' : 'Векторный')

    const getResponseMode = () => {
        if (!graphResponseMode.size) {
            return ''
        }
        let result = ''
        for (const [key, value] of graphResponseMode) {
            if (value.enabled) {
                result += `${GraphSearch.get(key)?.name}: ${GraphSearchResponse.get(value.id)?.name}. `
            }
        }
        return result
    }

    const getOpened = () => (
        <Paper className={cn(styles.wrapper, styles.opened)} elevation={0}>
            <SearchSettingsSwitch />
            <IconButton color="info" onClick={changeOpen} title="Применить настройки" size="small" className={styles.closeBtn}>
                <CloseIcon />
            </IconButton>

            <div className={styles.verticalLine}></div>
            <div className={styles.horizontalLine}></div>
            <div className={cn(styles.table, { [styles.disabled]: !isGraphEnabled })}>
                <SearchSettingsHead />
                {GraphSearchIds.map((graphSearchId) => (
                    <SearchSettingsRow graphSearchId={graphSearchId} key={graphSearchId} />
                ))}
            </div>
        </Paper>
    )

    return (
        <div className={styles.relative}>
            <Paper className={cn(styles.wrapper, styles.closed, { [styles.withoutShadow]: open })} elevation={0} onClick={changeOpen}>
                <span>{`Тип поиска: ${getSearchTypeStatus()}`}</span>
                <span>{getResponseMode()}</span>
            </Paper>

            {open && getOpened()}
        </div>
    )
}
