import React, { useContext } from 'react'
import { Route, Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './authContext';


const ProtectedRoute = () => {
    const {authed, setAuthed} = useContext(AuthContext);

    return (
        authed ? <Outlet/> : <Navigate to="/"/>
    )
}

export default ProtectedRoute