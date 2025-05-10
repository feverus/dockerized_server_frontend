import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

export const Copyright = () => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
            {'Copyright © '}
            <Link color="inherit" to="https://mui.com/">
                Великолепный сайт
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}
