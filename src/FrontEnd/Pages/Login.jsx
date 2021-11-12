import React from 'react'

import LoginForm from '../Components/Forms/LoginForm';
import Title from '../Components/Header/Title';

import '../Style/Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-title">
                   <Title />
                </div>
                <div className="login-form">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default Login
