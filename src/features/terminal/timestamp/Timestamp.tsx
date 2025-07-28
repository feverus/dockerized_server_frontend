import styles from './Timestamp.module.css'

type TimestampProps = { timestamp: number }

export const Timestamp = ({ timestamp }: TimestampProps) => {
    return <div className={styles.wrapper}>{new Date(timestamp).toLocaleTimeString('ru-Ru')}</div>
}
