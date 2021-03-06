
import { Button } from 'react-bootstrap';
import Logo from '../../../Assets/mainvrame.png'


import './Navbar.css';

const HomeNav = () => {
    

    return ( 
        <div className="nav-container">
            <div className="nav-logo">
                <img src={Logo} alt="logo" />
            </div>
            <div className="nav-content">
                {/* <Button href="/academy#signup-login" data-ms-content="!members" id="signs-button">Daftar atau Masuk</Button> */}

                <div className="profile" data-ms-content="members">
                    {/*To ignore the a tag warning */}
                    {/*eslint-disable-next-line*/}
                    Selamat Datang, &nbsp; <a href="#/ms/profile" data-ms-member="name"></a>
                </div>
                <div className="logout">
                    <Button variant="danger" className="logout-link" data-ms-content="members" href="#/ms/logout">Keluar</Button> 
                </div>
            </div>
        </div>
    );
}
 
export default HomeNav;