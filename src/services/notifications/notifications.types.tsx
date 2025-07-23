import type { NOTIFICATION_TYPE } from 'react-notifications-component'

export type NotificationComponentProps = {
    id: string
    type: NOTIFICATION_TYPE | 'error'
    message: string
    onClose: (key: string) => void
}

export type AddNotificationProps = Partial<NotificationComponentProps> & {
    autoHideDuration?: number
}
