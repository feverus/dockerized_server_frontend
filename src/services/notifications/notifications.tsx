import { Store } from 'react-notifications-component'

import { useChatStore } from 'store'
import { NotificationComponent } from './NotificationComponent'
import type { AddNotificationProps } from './notifications.types'
import styles from './NotificationComponent.module.css'

export const useNotificationsService = () => {
    const { setSeverityLevel } = useChatStore()

    const removeNotification = (id: string | null) => {
        id && Store.removeNotification(id)
    }

    const addNotification = ({ type = 'info', message = '', autoHideDuration = 5000 }: AddNotificationProps) => {
        const id = String(Date.now())

        switch (type) {
            case 'danger':
            case 'error':
                setSeverityLevel('error')
                break
            case 'info':
                setSeverityLevel('info')
                break
            case 'success':
            case 'default':
                setSeverityLevel('success')
                break
            case 'warning':
                setSeverityLevel('warning')
        }

        Store.addNotification({
            type: type === 'error' ? 'danger' : type,
            message,
            title: '',
            container: 'top-left',
            dismiss: {
                duration: autoHideDuration,
                pauseOnHover: false,
            },
            animationIn: [styles.animated, styles.zoomIn],
            animationOut: [styles.animated, styles.zoomOut],
            slidingExit: {
                duration: 200,
                timingFunction: 'ease-out',
                delay: 0,
            },
            slidingEnter: {
                duration: 200,
                timingFunction: 'ease-out',
                delay: 0,
            },
            id,

            content: () => {
                return <NotificationComponent id={id} type={type} message={message} onClose={removeNotification} />
            },
        })

        return id
    }

    return {
        addNotification,
        removeNotification,
    }
}
