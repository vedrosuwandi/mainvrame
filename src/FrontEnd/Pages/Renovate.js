import React from 'react';
import Construction from '../../Assets/construction.png';
import Pirrou from '../../Assets/pirrou.png';

import './Renovate.css';


const Renovate = () => {
    return (
        <div className="renovate-container">
            <div className="renovate-content">
                <div className="renovate-img">
                    <img src={Construction} alt="renovate" id="renovate"/>
                    <img src={Pirrou} alt="pirrou" id="pirrou"/>
                    <div className="renovate-details">
                        <p>
                            MAINVRAME is undergoing major renovation!
                            <br />
                            for more info, feel free to email us at 
                            <span style={{fontWeight:"bold"}}> info@omnivr.co </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Renovate
