import { Typography } from '@mui/material'

export const Copyright = () => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5, opacity: 0.5 }}>
            {`Copyright © ${import.meta.env.VITE_APP_NAME} ${new Date().getFullYear()}.`}
        </Typography>
    )
}
