import React from 'react'

import './Forms.css';
import MainvrameAcademy from '../Components/MainVrameAcademy';
import Signs from '../Components/Forms/Signs';


const Forms = () => {

    return (
        <div className="Forms">
            <div id="container">
                <div className="small-container-logo">
                    <div className="small-logo">
                        <h1>Selamat Datang di</h1>
                        <MainvrameAcademy />
                    </div>
                </div>
                <div className="form-container">
                    <div className="form-container-wrapper">
                        <Signs />
                    </div>
                </div>
            </div>
        </div>
      
    )
}

export default Forms
