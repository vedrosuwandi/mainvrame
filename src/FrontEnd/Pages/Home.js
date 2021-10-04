import React from 'react'
import{Link} from 'react-router-dom'
import {Button } from 'react-bootstrap';

import Construction from '../../Assets/constructions.png';
// import Pirrou from '../../Assets/pirrou.png';

import './Home.css';
import Footer from '../Components/Footer/Footer';
import Info from '../Components/Footer/Info';


const Home = () => {
  
    return (
        <div className="home-container">
            {/* 
            <div className="home-header">
                <img src={Logo} id="mainvrame" alt="logo"/>
            </div> 
            */}
            <div className="home-content">
                
                <div className="img-content">
                    <img src={Construction} alt="construction" id="construct" />
                    {/* <div className="pirrou-container">
                        <img src={Pirrou} alt="pirrou" id="pirrou" />
                    </div>    */}
                </div>
                <div className="page-content">
                    <h1>MainVRame City Segera Hadir</h1>
                    <div className="content-details">
                        <p>
                            MainVRame City adalah metaverse baru yang akan segera hadir di Indonesia. Metaverse ini sedang dibangun. 
                            Untuk saat ini, silakan daftarkan dirimu di MainVRame Academy untuk berkenalan dengan para VTuber 
                            favoritmu saat peluncurannya sebentar lagi.
                        </p>
                    </div>
                    <Link to="/academy">
                        <Button id="visit-academy">
                            Kunjungi Academy
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="info">
                <Info />
            </div>
            <div className="footer">
                <Footer />
            </div>
           
        </div>
    )
}

export default Home
