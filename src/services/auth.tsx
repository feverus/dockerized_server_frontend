import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store'
import type { LoginUserProps } from './auth.types'

const REFRESH_INTERVAL = 1000 * 60 * 1 // 1 минута

export const useAuthService = () => {
    const navigate = useNavigate()
    const { authTokens, initialized, setAuthTokens, setUser, init } = useAuthStore()

    const loginUser = async (props: LoginUserProps) => {
        const response = await fetch('http://localhost:80/auth/login', {
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
        const response = await fetch('http://localhost:80/auth/logout', {
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
        const response = await fetch('http://localhost:80/auth/refresh', {
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

    useEffect(() => {
        if (!initialized) {
            init()
        }
        const interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)
    }, [authTokens, init, initialized, updateToken])

    return {
        loginUser,
        logoutUser,
    }
}
