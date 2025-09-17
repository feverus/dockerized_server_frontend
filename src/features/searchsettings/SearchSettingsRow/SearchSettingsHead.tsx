import { useEffect, useState } from 'react'
import { Checkbox, Select, MenuItem, type SelectChangeEvent, Tooltip } from '@mui/material'
import cn from 'classnames'

import { GraphSearch, GraphSearchIds, GraphSearchResponse, GraphSearchResponseIds, type GraphSearchResponseIdType } from 'models'
import { useWebSocketService } from 'services'
import { useChatStore, useSettingsStore } from 'store'
import styles from './SearchSettingsRow.module.css'

export const SearchSettingsHead = () => {
    const [indeterminate, setIndeterminate] = useState(false)
    const [checked, setChecked] = useState(false)
    const { sendMessageWithType } = useWebSocketService()
    const {
        graphResponseModeCommonId,
        setCommonGraphResponseMode,
        graphResponseMode,
        getEnabledGraphSearchIds,
        enableAllGraphResponse,
        disableAllGraphResponse,
    } = useSettingsStore()
    const setIsLoading = useChatStore((state) => state.setIsLoading)

    const responseSelectChangeHandler = (event: SelectChangeEvent) => {
        setCommonGraphResponseMode(event.target.value as GraphSearchResponseIdType)
        GraphSearchIds.forEach((key) => {
            sendMessageWithType(event.target.value, GraphSearch.get(key)?.api)
        })
    }
    const responseCheckboxClickHandler = () => {
        setIsLoading(true)
        if (checked) {
            disableAllGraphResponse()
            sendMessageWithType(['None'], 'set_search_type')
        } else {
            enableAllGraphResponse()
            sendMessageWithType(GraphSearchIds, 'set_search_type')
        }
    }

    useEffect(() => {
        switch (getEnabledGraphSearchIds().length) {
            case 0:
                setChecked(false)
                setIndeterminate(false)
                break
            case graphResponseMode.size:
                setChecked(true)
                setIndeterminate(false)
                break

            default:
                setIndeterminate(true)
                break
        }
    }, [getEnabledGraphSearchIds, graphResponseMode])

    return (
        <div className={cn(styles.row, styles.head)}>
            <div className={styles.name}></div>
            <div className={styles.checkbox}>
                <Tooltip title={checked ? 'Отключить все' : 'Выбрать все'} placement="top">
                    <Checkbox checked={checked} onClick={responseCheckboxClickHandler} indeterminate={indeterminate} />
                </Tooltip>
            </div>
            <div className={styles.response}>
                <Tooltip title={'Установить одно значение'} placement="top">
                    <Select
                        className={styles.select}
                        value={graphResponseModeCommonId ?? ''}
                        onChange={responseSelectChangeHandler}
                        variant="standard"
                    >
                        {GraphSearchResponseIds.map((id) => (
                            <MenuItem value={id} key={id}>
                                {GraphSearchResponse.get(id)?.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Tooltip>
            </div>
        </div>
    )
}
