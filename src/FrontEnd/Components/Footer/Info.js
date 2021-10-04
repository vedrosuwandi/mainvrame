import Logo from '../../../Assets/mainvrame.png'

import CityInfo from './CityInfo';
import CompanyInfo from './CompanyInfo';
import SosMedInfo from './SosMedInfo';

import './Info.css';

const Info = () => {
    return ( 
         <div className="home-info">
            <img src={Logo} style={{width:"20%" , height:"50%"}} alt="logo" id="mainvrame"/>
            <div className="info-details">
                <CityInfo />
                <CompanyInfo />
                <SosMedInfo />
            </div>
        </div>
 );
}
 
export default Info;