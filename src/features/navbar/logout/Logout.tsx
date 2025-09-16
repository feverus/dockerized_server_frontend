import { IconButton } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { useAuthService } from 'services'

export const Logout = () => {
    const { logoutUser } = useAuthService()

    return (
        <IconButton color="inherit" aria-label="logout" onClick={logoutUser} edge="end">
            <ExitToAppIcon />
        </IconButton>
    )
}
