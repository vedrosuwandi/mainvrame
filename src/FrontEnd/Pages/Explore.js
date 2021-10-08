import './Explore.css';

import Footer from '../Components/Footer/Footer';
import Info from '../Components/Footer/Info';
import Nav from '../Components/Header/Navbar';
import WelcomeJumbotron from '../Components/Body/WelcomeJumbotron';
import Signs from '../Components/Forms/Signs';

const Explore = () => {
    

    return (
        <div className="explore" >
            <Nav />
            <WelcomeJumbotron />
            <div className="forms" id="signup-login" data-ms-content="!members">
                <div className="forms-wrapper">
                    <Signs />
                </div>
            </div>
            <div className="explore-info">
                <Info />
            </div>
            <div className="explore-footer">
                <Footer />
            </div>
        </div>
    )
}

export default Explore
