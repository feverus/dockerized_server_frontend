import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '../store'

const PrivateRoute = () => {
    const { user } = useAuthStore()
    return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
