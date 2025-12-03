import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from 'store'
import type { LoginUserProps } from './auth.types'
import { useNotificationsService } from 'services/notifications'

const AUTH_API = import.meta.env.VITE_AUTH_API

export const useAuthService = () => {
    const navigate = useNavigate()
    const { initialized, setUser, setInitialized } = useAuthStore()
    const { addNotification } = useNotificationsService()

    const loginUser = async (props: LoginUserProps) => {
        const body = new URLSearchParams({
            username: props.username,
            password: props.password,
        })
        const response = await fetch(`${AUTH_API}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            credentials: 'include',
            body,
        })

        //временно для отладки на localhost
        /* document.cookie =
            'session=t9hVbOuENafV8WxSbqhM7ILxjGqnBh6JDtz5ROXX5Cm/cKb1yEorIhXoHKv0VYLKKPjOTQSQR4j3Gs2WCd4WvJvjaTX6icLuAu7Fbo/R0VhIfGjtR7WzqeAaxlOTsFmChv3/p8z+J8++CVlipf0WTFHzfVSatTId; expires=Thu, 01 Jan 2070 00:00:00 UTC; path=/; domain=localhost;' */

        if (response.status === 401) {
            addNotification({ type: 'error', message: 'Указаны несуществующие данные авторизации', autoHideDuration: 0 })
            return
        }
        try {
            const data = await response.json()
            if (Object.prototype.hasOwnProperty.call(data, 'response') && data.response === 'ok') {
                setUser(props.username)
                localStorage.setItem('username', props.username)
                navigate('/profile')
            } else {
                addNotification({ type: 'error', message: `Ошибка авторизации, ответ сервера: ${data}`, autoHideDuration: 0 })
            }
        } catch (e) {
            console.error(e)
        }
    }

    const logoutUser = useCallback(async () => {
        setUser(null)
        localStorage.removeItem('username')

        const response = await fetch(`${AUTH_API}logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: null,
        })
        try {
            console.log(response)
        } catch (e) {
            console.error(e)
        }
        navigate('/login')
    }, [navigate, setUser])

    useEffect(() => {
        if (initialized) {
            return
        }
        const username = localStorage.getItem('username')
        if (username) {
            setUser(username)
        } else {
            logoutUser()
        }
        setInitialized(true)
    }, [initialized, logoutUser, setInitialized, setUser])

    return {
        loginUser,
        logoutUser,
    }
}
