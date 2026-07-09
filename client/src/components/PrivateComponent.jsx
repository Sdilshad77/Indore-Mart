import React from 'react'
import useAuthStatus from '../hooks/useAuthStatus'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateComponent = () => {

    const { isAuthenticated, checkAuthentication } = useAuthStatus()

    if (checkAuthentication) {
        return (
            <h1>Checking User...</h1>
        )
    }


    return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />

}

export default PrivateComponent
