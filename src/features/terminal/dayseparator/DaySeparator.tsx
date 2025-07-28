import type { Message } from '../../../store'
import { isSameDay } from '../../../utils'
import styles from './DaySeparator.module.css'

type DaySeparatorProps = { messages: Message[]; index: number }

const separator = (timestamp: number) => (
    <div className={styles.wrapper}>
        {new Date(timestamp).toLocaleDateString('ru-Ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}
    </div>
)
export const DaySeparator = ({ messages, index }: DaySeparatorProps) => {
    if (index === 0) {
        return <div className={styles.wrapper}>{separator(messages[index].timestamp)}</div>
    }
    if (isSameDay(new Date(messages[index].timestamp), new Date(messages[index - 1].timestamp))) {
        return
    }
    return <div className={styles.wrapper}>{separator(messages[index].timestamp)}</div>
}
