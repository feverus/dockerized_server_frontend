import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from 'store'

export const PrivateRoute = () => {
    //return <Outlet /> 
    const { user } = useAuthStore()
    return user ? <Outlet /> : <Navigate to="/login" />
}
