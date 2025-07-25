import { useState } from 'react'
import classNames from 'classnames'
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, type SelectChangeEvent } from '@mui/material'

import { useSettingsStore } from '../../store'
import { GraphSearchResponseTypes, GraphSearchTypes, SearchTypes } from '../../models'
import styles from './SearchSettings.module.css'

export const SearchSettings = () => {
    const [open, setOpen] = useState(false)
    const {
        chatSearchType,
        chatGraphSearchType,
        chatGraphSearchResponseType,
        setСhatSearchType,
        setChatGraphSearchType,
        setChatGraphSearchResponseType,
    } = useSettingsStore()

    const handleChangeSearchType = (event: SelectChangeEvent) => {
        const type = SearchTypes.find(({ id }) => id === event.target.value)
        type && setСhatSearchType(type)
    }

    const handleChangeGraphSearchType = (event: SelectChangeEvent) => {
        const type = GraphSearchTypes.find(({ id }) => id === event.target.value)
        type && setChatGraphSearchType(type)
    }

    const handleChangeGraphSearchResponseType = (event: SelectChangeEvent) => {
        const type = GraphSearchResponseTypes.find(({ id }) => id === event.target.value)
        type && setChatGraphSearchResponseType(type)
    }

    if (open) {
        return (
            <Paper className={classNames(styles.wrapper, styles.opened)} elevation={3}>
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
                    <Button variant="outlined" onClick={() => setOpen(false)}>
                        Ok
                    </Button>
                </div>
            </Paper>
        )
    }

    return (
        <Paper className={classNames(styles.wrapper, styles.closed)} elevation={3} onClick={() => setOpen(true)}>
            <span>{`Тип поиска: ${chatSearchType.name}`}</span>
            <span>{chatSearchType.id !== 'vector' && `Тип ответа графа: ${chatGraphSearchType.name}`}</span>
            <span>{`Режим вывода ответа: ${chatGraphSearchResponseType.name}`}</span>
        </Paper>
    )
}
