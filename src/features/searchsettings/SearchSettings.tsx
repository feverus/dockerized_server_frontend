import { useState } from 'react'
import classNames from 'classnames'
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, type SelectChangeEvent } from '@mui/material'

import { useChatStore, useSettingsStore } from '../../store'
import { GraphSearchResponseTypes, GraphSearchTypes, SearchTypes } from '../../models'
import { useWebSocketService } from '../../services'
import styles from './SearchSettings.module.css'

export const SearchSettings = () => {
    const { sendMessageWithType } = useWebSocketService()
    const [open, setOpen] = useState(false)
    const {
        chatSearchType,
        chatGraphSearchType,
        chatGraphSearchResponseType,
        setСhatSearchType,
        setChatGraphSearchType,
        setChatGraphSearchResponseType,
    } = useSettingsStore()
    const setIsSettingsOpened = useChatStore((state) => state.setIsSettingsOpened)

    const changeOpen = () => {
        setIsSettingsOpened(!useChatStore.getState().isSettingsOpened)
        setOpen(!open)
    }

    const handleChangeSearchType = (event: SelectChangeEvent) => {
        const type = SearchTypes.find(({ id }) => id === event.target.value)
        type && setСhatSearchType(type)
    }

    const handleChangeGraphSearchType = (event: SelectChangeEvent) => {
        const type = GraphSearchTypes.find(({ id }) => id === event.target.value)
        if (type) {
            sendMessageWithType(type.message, 'set_search_type')
            setChatGraphSearchType(type)
        }
    }

    const handleChangeGraphSearchResponseType = (event: SelectChangeEvent) => {
        const type = GraphSearchResponseTypes.find(({ id }) => id === event.target.value)
        if (type) {
            setChatGraphSearchResponseType(type)
            if (chatGraphSearchType.id === 'local_search' || chatGraphSearchType.id === 'both') {
                sendMessageWithType(type.id, 'set_graph_local_search_response_type')
            }
            if (chatGraphSearchType.id === 'global_search_advanced' || chatGraphSearchType.id === 'both') {
                sendMessageWithType(type.id, 'set_graph_global_search_advanced_response_type')
            }
        }
    }

    return (
        <div className={styles.relative}>
            <Paper
                className={classNames(styles.wrapper, styles.closed, { [styles.withoutShadow]: open })}
                elevation={0}
                onClick={changeOpen}
            >
                <span>{`Тип поиска: ${chatSearchType.name}`}</span>
                <span>{chatSearchType.id !== 'vector' && `Тип ответа графа: ${chatGraphSearchType.name}`}</span>
                <span>{`Режим вывода ответа: ${chatGraphSearchResponseType.name}`}</span>
            </Paper>

            {open && (
                <Paper className={classNames(styles.wrapper, styles.opened)} elevation={0}>
                    <FormControl>
                        <InputLabel>Тип поиска</InputLabel>
                        <Select
                            className={styles.select}
                            value={chatSearchType.id}
                            label={chatSearchType.name}
                            onChange={handleChangeSearchType}
                        >
                            {SearchTypes.map(({ id, name }) => (
                                <MenuItem value={id} key={id}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {chatSearchType.id !== 'vector' && (
                        <FormControl>
                            <InputLabel>Тип ответа графа</InputLabel>
                            <Select
                                className={styles.select}
                                value={chatGraphSearchType.id}
                                label={chatGraphSearchType.name}
                                onChange={handleChangeGraphSearchType}
                            >
                                {GraphSearchTypes.map(({ id, name }) => (
                                    <MenuItem value={id} key={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    <FormControl>
                        <InputLabel>Режим вывода ответа</InputLabel>
                        <Select
                            className={styles.select}
                            value={chatGraphSearchResponseType.id}
                            label={chatGraphSearchResponseType.name}
                            onChange={handleChangeGraphSearchResponseType}
                        >
                            {GraphSearchResponseTypes.map(({ id, name }) => (
                                <MenuItem value={id} key={id}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div className={styles.closeBtn}>
                        <Button variant="outlined" onClick={changeOpen}>
                            Ok
                        </Button>
                    </div>
                </Paper>
            )}
        </div>
    )
}
