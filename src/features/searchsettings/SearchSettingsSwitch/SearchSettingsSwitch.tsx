import { Switch } from '@mui/material'

import { useWebSocketService } from 'services'
import { useChatStore, useSettingsStore } from 'store'
import styles from './SearchSettingsSwitch.module.css'

export const SearchSettingsSwitch = () => {
    const { sendMessageWithType } = useWebSocketService()
    const { isGraphEnabled, enableGraph, disableGraph, getEnabledGraphSearchIds } = useSettingsStore()
    const setIsLoading = useChatStore((state) => state.setIsLoading)

    const isGraphEnabledSwitchClickHandler = () => {
        setIsLoading(true)
        if (isGraphEnabled) {
            disableGraph()
            sendMessageWithType(['None'], 'set_search_type')
        } else {
            enableGraph()
            sendMessageWithType(getEnabledGraphSearchIds(), 'set_search_type')
        }
    }

    return (
        <div className={styles.wrapper}>
            <Switch checked={isGraphEnabled} onClick={isGraphEnabledSwitchClickHandler} />
            <div className={styles.caption}>Графовый поиск</div>
        </div>
    )
}
