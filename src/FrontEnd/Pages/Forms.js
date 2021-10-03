import React from 'react'
import Login from '../Components/Forms/Login';
import Register from '../Components/Forms/Register';

import { useState } from 'react';

import './Forms.css';
import  {Button} from 'react-bootstrap';
import MainvrameAcademy from '../Components/MainVrameAcademy';

const Forms = () => {
    const [toogle, setToogle] = useState(false);
    
    const handleChange = () =>{
       setToogle(!toogle);
    }

    return (
        <div className="Forms">
            <div id="container" className={`small-container${toogle ? " right-panel-active" : ""}`} >
                <div className="small-container-logo">
                    <div className="small-logo">
                        <h1>Selamat Datang di</h1>
                        <MainvrameAcademy />
                    </div>
                </div>
                <div className="form-container">
                <div className="small-form-container">
                    <div className="small-form-wrapper">
                        <div className="small-state-toogle">
                            <div className="small-toogle-select"></div>
                            <Button id="toogle-button" onClick={handleChange} disabled={toogle? false : true}>
                                Masuk
                            </Button>
                            <Button id="toogle-button" onClick={handleChange} disabled={toogle? true : false}>
                                Daftar
                            </Button>
                        </div>
                        <div className="small-form-content">
                            <div className="small-login-form">
                                <Login />
                            </div>
                            <div className="small-register-form">
                                <Register />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
               
            </div>
        </div>
      
    )
}

export default Forms
