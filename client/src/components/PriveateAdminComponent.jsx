import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthAdminStatus from '../hooks/useAuthAdminStatus'

const PriveateAdminComponent = () => {
    const { isAdmin, checkAuthentication } = useAuthAdminStatus()


    if (checkAuthentication) {
        return (
            <h1>Checking User...</h1>
        )
    }


    return isAdmin ? <Outlet /> : <Navigate to={"/"} />
}

export default PriveateAdminComponent
