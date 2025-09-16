import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, TextField, FormControlLabel, Checkbox, Button, Grid, Typography } from '@mui/material'

import { useAuthService } from 'services'

export const LoginForm = () => {
    const { loginUser } = useAuthService()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)

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
            />
            <FormControlLabel
                control={<Checkbox id="remember" color="primary" value={remember} onChange={(e) => setRemember(e.target.checked)} />}
                label="Запомнить меня"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => loginUser({ username, password, remember })}
            >
                Войти
            </Button>
            <Grid container>
                <Grid item xs={6}>
                    <Link to="#">
                        <Typography variant="body2">Забыли пароль?</Typography>
                    </Link>
                </Grid>
                <Grid item xs={6}>
                    <Link to="#">
                        <Typography variant="body2">Нет аккаунта? Зарегистрируйтесь!</Typography>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    )
}
