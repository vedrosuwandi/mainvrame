import Logo from '../Assets/mainvrame.png';

import CityInfo from '../Components/CityInfo';
import CompanyInfo from '../Components/CompanyInfo';
import SosMedInfo from '../Components/SosMedInfo';

import './Footer.css';

const Footer = () => {
    return ( 
        <div>
             <div className="home-info">
                <img src={Logo} style={{width:"20%" , height:"50%"}} alt="logo" id="mainvrame"/>
                <div className="info-details">
                    <CityInfo />
                    <CompanyInfo />
                    <SosMedInfo />
                </div>
            </div>
            <div className="home-footer">
                <footer>
                    <p>Hak cipta © 2021 OmniVR. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
 
export default Footer;