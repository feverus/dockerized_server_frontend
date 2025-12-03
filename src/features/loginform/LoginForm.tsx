import { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'

import { useAuthService } from 'services'
import styles from './LoginForm.module.css'

export const LoginForm = () => {
    const { loginUser } = useAuthService()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <Box sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Ваше имя пользователя"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.textField}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Ваш пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.textField}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => loginUser({ username, password })}>
                Войти
            </Button>
        </Box>
    )
}
