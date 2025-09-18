import { Switch } from '@mui/material'

import { useWebSocketService } from 'services'
import { useChatStore, useSettingsStore } from 'store'
import { GraphSearchIdsEmptyArray } from 'models'
import styles from './SearchSettingsSwitch.module.css'

export const SearchSettingsSwitch = () => {
    const { sendMessageWithType } = useWebSocketService()
    const { isGraphEnabled, enableGraph, disableGraph, getEnabledGraphSearchIds } = useSettingsStore()
    const setIsLoading = useChatStore((state) => state.setIsLoading)

    const isGraphEnabledSwitchClickHandler = () => {
        setIsLoading(true)
        if (isGraphEnabled) {
            disableGraph()
            sendMessageWithType(GraphSearchIdsEmptyArray, 'set_search_type')
        } else {
            enableGraph()
            const newIds = getEnabledGraphSearchIds()
            sendMessageWithType(newIds.length ? newIds : GraphSearchIdsEmptyArray, 'set_search_type')
        }
    }

    return (
        <div className={styles.wrapper}>
            <Switch checked={isGraphEnabled} onClick={isGraphEnabledSwitchClickHandler} />
            <div className={styles.caption}>Графовый поиск</div>
        </div>
    )
}
