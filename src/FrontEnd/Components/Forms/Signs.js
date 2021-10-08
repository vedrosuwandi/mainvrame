import React from 'react'
import Login from './Login';
import Register from './Register';

import { useState } from 'react';

import './Signs.css';
import  {Button} from 'react-bootstrap';

const Signs = () => {
    
    const [toogle, setToogle] = useState(false);
    
    const handleChange = () =>{
       setToogle(!toogle);
    
    }

    return ( 
        <div id="small-form-container" className={`small-form-container${toogle ? " right-panel-active" : ""}`}>
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
     );
}
 
export default Signs;