import React from 'react'

import Footer from '../Components/Footer/Footer';
import Info from '../Components/Footer/Info';

import FormsNav from '../Components/Header/FormsNav';
import WelcomeJumbotron from '../Components/Body/WelcomeJumbotron';
import './Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome" >
            <FormsNav />
            <WelcomeJumbotron />
        <div className="welcome-info">
            <Info />
        </div>
        <div className="welcome-footer">
            <Footer />
        </div>
    </div>
    )
}

export default Welcome
