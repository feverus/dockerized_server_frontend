import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '../store'

export const PrivateRoute = () => {
    const { user } = useAuthStore()
    return user ? <Outlet /> : <Navigate to="/login" />
}
