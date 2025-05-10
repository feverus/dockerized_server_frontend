import Avatar from '@mui/material/Avatar'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { Copyright, LoginForm } from '../features'

const defaultTheme = createTheme()

export const LoginPage = () => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={6}
                    sx={{
                        backgroundImage:
                            'url(https://sun9-88.userapi.com/impg/Fna9RT8x9g9qE2OnRzN2mPAN_jWmyR_cyh1NlQ/Nr5VLrSZELs.jpg?size=1147x1150&quality=96&sign=de041a77a758f7715fb821c3dbacb47e&c_uniq_tag=I3ecmZLkzv0AAcG7MHJlARsAEp61_X29KujSVtRET-s&type=album)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" align={'center'}>
                            Войти в замечательную систему
                        </Typography>
                        <LoginForm />
                        <Copyright />
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}
