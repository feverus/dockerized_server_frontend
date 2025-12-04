import { useState } from 'react'
import { Box, TextField, Button, IconButton, InputAdornment } from '@mui/material'
import { VisibilityOff, Visibility } from '@mui/icons-material'

import { useAuthService, useNotificationsService } from 'services'
import styles from './LoginForm.module.css'

export const LoginForm = () => {
    const { loginUser } = useAuthService()
    const { addNotification } = useNotificationsService()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const submit = () => {
        if (!username) {
            addNotification({ type: 'warning', message: `Не указано имя пользователя`, autoHideDuration: 3000 })
            return
        }
        if (!password) {
            addNotification({ type: 'warning', message: `Не заполнен пароль`, autoHideDuration: 3000 })
            return
        }
        loginUser({ username, password })
    }

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter') {
            return
        }
        submit()
    }

    return (
        <Box sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Имя пользователя"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                className={styles.textField}
                onChange={(e) => setUsername(e.target.value)}
                onKeyUp={onKeyUpHandler}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                className={styles.textField}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={onKeyUpHandler}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={submit}>
                Войти
            </Button>
        </Box>
    )
}
