import React, {useEffect} from 'react';
import Button from '@mui/material/Button';

import '../Style/Home.css';
import Title from '../Components/Header/Title';


const Home = () => {
  
    useEffect(() => {
        if(localStorage.getItem("refreshToken") !== null){
            window.location.href = "/dashboard"
        }
    }, [])

    return (
        <div className="home-container">
            <div className="home-wrapper">
                <div className="home-title">
                    <Title />
                </div>
                <div className="home-content">
                    <div className="home-content-wrapper">
                        <div className="home-login">
                            <Button variant="contained" href="/login" id="login-button" fullWidth>Login</Button>
                        </div>
                        <div className="home-or-border">
                            OR
                        </div>
                        <div className="register-login">
                            <Button variant="contained" href="/register" id="register-button" fullWidth>Register</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
