import React, { useState, useContext} from 'react';
import './nav.css';

import { UserContext } from '../userContext';
import { AuthContext } from '../authContext';



export default function Navbar( {history} ) {
    const {userId, setUserId} = useContext(UserContext);
    const {authed, setAuthed} = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.setItem('rememberMe', false);
        localStorage.setItem('userId', '');

        setUserId(null);
        setAuthed(false);
    }

    return (
        <div className="bar">
            <h1>Классный кот на лендинге, да? ^_^</h1>
            <button 
                className="signout"
                onClick={() => {
                    handleLogout();
                }}
                >Выйти
        </button>
        </div>
    )
}