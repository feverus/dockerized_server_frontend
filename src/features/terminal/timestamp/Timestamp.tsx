import styles from './Timestamp.module.css'

type TimestampProps = { timestamp: number }

export const Timestamp = ({ timestamp }: TimestampProps) => {
    const time = new Date(timestamp).toLocaleTimeString('ru-Ru')
    if (time === 'Invalid Date') {
        return
    }
    return <div className={styles.wrapper}>{new Date(timestamp).toLocaleTimeString('ru-Ru')}</div>
}
