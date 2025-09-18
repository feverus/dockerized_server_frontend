import { type SelectChangeEvent, Checkbox, Select, MenuItem } from '@mui/material'
import {
    GraphSearch,
    GraphSearchIdsEmptyArray,
    GraphSearchResponse,
    GraphSearchResponseIds,
    type GraphSearchIdType,
    type GraphSearchResponseIdType,
} from 'models'
import { useWebSocketService } from 'services'
import { useChatStore, useSettingsStore } from 'store'
import styles from './SearchSettingsRow.module.css'

type SearchSettingsRowProps = { graphSearchId: GraphSearchIdType }

export const SearchSettingsRow = ({ graphSearchId }: SearchSettingsRowProps) => {
    const { sendMessageWithType } = useWebSocketService()
    const { graphResponseMode, enableGraphResponse, disableGraphResponse, setGraphResponseMode, getEnabledGraphSearchIds } =
        useSettingsStore()
    const setIsLoading = useChatStore((state) => state.setIsLoading)

    const checked = graphResponseMode.get(graphSearchId)?.enabled ?? false
    const graphSearchResponseId = graphResponseMode.get(graphSearchId)?.id ?? GraphSearchResponseIds[0]

    const graphSearchCheckboxClickHandler = () => {
        setIsLoading(true)
        if (checked) {
            disableGraphResponse(graphSearchId)
            const newIds = getEnabledGraphSearchIds().filter((id) => id !== graphSearchId)
            sendMessageWithType(newIds.length ? newIds : GraphSearchIdsEmptyArray, 'set_search_type')
        } else {
            enableGraphResponse(graphSearchId)
            const newIds = getEnabledGraphSearchIds()
            sendMessageWithType(newIds.length ? newIds : GraphSearchIdsEmptyArray, 'set_search_type')
        }
    }

    const responseSelectChangeHandler = (event: SelectChangeEvent) => {
        setGraphResponseMode(graphSearchId, event.target.value as GraphSearchResponseIdType)
        sendMessageWithType(event.target.value, GraphSearch.get(graphSearchId)?.api)
    }

    return (
        <div className={styles.row} key={graphSearchId}>
            <div className={styles.name}>{GraphSearch.get(graphSearchId)?.name}</div>
            <div className={styles.checkbox}>
                <Checkbox checked={checked} onClick={graphSearchCheckboxClickHandler} />
            </div>
            <div className={styles.response}>
                <Select className={styles.select} value={graphSearchResponseId} onChange={responseSelectChangeHandler} variant="standard">
                    {GraphSearchResponseIds.map((id) => (
                        <MenuItem value={id} key={id}>
                            {GraphSearchResponse.get(id)?.name}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </div>
    )
}
