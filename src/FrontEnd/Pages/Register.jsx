import React from 'react'

import RegisterForm from '../Components/Forms/RegisterForm';
import Title from '../Components/Header/Title';
import '../Style/Register.css';

const Register = () => {
    return (
        <div className="register-container">
            <div className="register-wrapper">
                <div className="register-title">
                    <Title />
                </div>
                <div className="register-content">
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}

export default Register
