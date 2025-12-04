import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { IconButton, LinearProgress, Paper } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useChatStore, useSettingsStore } from 'store'
import { GraphSearch, GraphSearchIds, GraphSearchResponse } from 'models'
import { SearchSettingsHead, SearchSettingsRow } from './searchsettingsrow'
import { SearchSettingsSwitch } from './searchsettingsswitch'
import styles from './SearchSettings.module.css'

export const SearchSettings = () => {
    const becomeLong = useRef<NodeJS.Timer | null>(null)
    const [open, setOpen] = useState(false)
    const [isLongLoading, setIsLongLoading] = useState(false)
    const isGraphEnabled = useSettingsStore((state) => state.isGraphEnabled)
    const graphResponseMode = useSettingsStore((state) => state.graphResponseMode)
    const isLoading = useChatStore((state) => state.isLoading)
    const setIsSettingsOpened = useChatStore((state) => state.setIsSettingsOpened)

    // Т.к. запрос может выполниться быстро, не показываем лоадер сразу, а немного ждём
    useEffect(() => {
        if (isLoading) {
            becomeLong.current = setTimeout(() => setIsLongLoading(true), 50)
        } else {
            becomeLong.current && clearTimeout(becomeLong.current)
            setIsLongLoading(false)
        }
        return () => {
            becomeLong.current && clearTimeout(becomeLong.current)
            setIsLongLoading(false)
        }
    }, [isLoading])

    const changeOpen = () => {
        setIsSettingsOpened(!useChatStore.getState().isSettingsOpened)
        setOpen(!open)
    }

    const getSearchTypeStatus = () => (isGraphEnabled ? 'Векторный + Графовый' : 'Векторный')

    const getResponseModeText = () => {
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

    const getLoader = () => <LinearProgress className={styles.loader} />

    const getOpened = () => (
        <Paper className={cn(styles.wrapper, styles.opened, { [styles.isLoading]: isLongLoading })} elevation={0}>
            <SearchSettingsSwitch />
            <IconButton color="info" onClick={changeOpen} title="Применить настройки" size="small" className={styles.closeBtn}>
                <CloseIcon />
            </IconButton>

            <div className={styles.tableWrapper}>
                <div className={cn(styles.table, { [styles.disabled]: !isGraphEnabled })}>
                    <div className={styles.verticalLine}></div>
                    <div className={styles.horizontalLine}></div>
                    <SearchSettingsHead />
                    {GraphSearchIds.map((graphSearchId) => (
                        <SearchSettingsRow graphSearchId={graphSearchId} key={graphSearchId} />
                    ))}
                </div>
            </div>
        </Paper>
    )

    return (
        <div className={styles.relative}>
            {isLongLoading && getLoader()}
            {open ? (
                getOpened()
            ) : (
                <Paper className={cn(styles.wrapper, styles.closed, { [styles.withoutShadow]: open })} elevation={0} onClick={changeOpen}>
                    <span>{`Тип поиска: ${getSearchTypeStatus()}`}</span>
                    <span>{getResponseModeText()}</span>
                </Paper>
            )}
        </div>
    )
}
