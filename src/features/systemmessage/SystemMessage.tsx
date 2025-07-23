import classNames from 'classnames'

import { useChatStore } from '../../store'
import styles from './SystemMessage.module.css'

export const SystemMessage = () => {
    const { severityLevel } = useChatStore()

    return (
        <div className={classNames(styles.base, styles[severityLevel])} />
    )
}
