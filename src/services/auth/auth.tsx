import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../store'
import { REFRESH_INTERVAL } from '../../assets'
import type { LoginUserProps } from './auth.types'
import { returnGreeting } from '../../utils'

const AUTH_API = import.meta.env.VITE_AUTH_API

export const useAuthService = () => {
    const navigate = useNavigate()
    const { authTokens, initialized, setAuthTokens, setUser, setInitialized } = useAuthStore()
    const interval = useRef<NodeJS.Timer | null>(null)

    const loginUser = async (props: LoginUserProps) => {
        const response = await fetch(`${AUTH_API}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username: props.username, password: props.password, stay_logged_in: props.remember }),
        })
        try {
            const data = await response.json()
            if (Object.prototype.hasOwnProperty.call(data, 'access') && Object.prototype.hasOwnProperty.call(data, 'user')) {
                setAuthTokens(data.access)
                setUser(data.user)
                localStorage.setItem('access', JSON.stringify(data.access))
                localStorage.setItem('current_user', JSON.stringify(data.user))
                navigate('/profile')
            } else {
                alert('Something went wrong!')
            }
        } catch (e) {
            console.error(e)
        }
    }

    const logoutUser = useCallback(async () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('access')
        localStorage.removeItem('current_user')
        const response = await fetch(`${AUTH_API}logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: null,
        })
        try {
            const data = await response.json()
            console.log(data)
        } catch (e) {
            console.error(e)
        }
        navigate('/login')
    }, [navigate, setAuthTokens, setUser])

    const updateToken = useCallback(async () => {
        if (!authTokens) {
            return
        }
        const response = await fetch(`${AUTH_API}refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ access: authTokens }),
        })
        try {
            const data = await response.json()
            if (Object.prototype.hasOwnProperty.call(data, 'access')) {
                setAuthTokens(data.access)
                localStorage.setItem('access', JSON.stringify(data.access))
            } else {
                logoutUser()
            }
        } catch (e) {
            console.error(e)
        }
    }, [authTokens, logoutUser, setAuthTokens])

    const getUsername = useCallback(
        async (authTokens: string | null) => {
            if (!authTokens) {
                return ''
            }
            try {
                const response = await fetch(`${AUTH_API}get_user_profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + String(authTokens),
                    },
                    credentials: 'include',
                })
                if (response.status === 200) {
                    const data = await response.json()
                    return returnGreeting(data.user)
                } else if (response.statusText === 'Unauthorized') {
                    logoutUser()
                    return ''
                } else {
                    throw new Error('Ответ сети был не ok.')
                }
            } catch (error) {
                console.log('Возникла проблема с вашим fetch запросом: ', error instanceof Error ? error.message : error)
                return ''
            }
        },
        [logoutUser],
    )

    const init = useCallback(() => {
        const authTokens = localStorage.getItem('access')
        authTokens && setAuthTokens(authTokens)
        const user = localStorage.getItem('current_user')
        user && setUser(user)
        setInitialized(true)
    }, [setAuthTokens, setInitialized, setUser])

    useEffect(() => {
        if (!initialized) {
            init()
        } else {
            interval.current = setInterval(() => updateToken(), REFRESH_INTERVAL)
        }
        return () => {
            interval.current && clearInterval(interval.current)
        }
    }, [init, initialized, updateToken])

    return {
        loginUser,
        logoutUser,
        getUsername,
    }
}
