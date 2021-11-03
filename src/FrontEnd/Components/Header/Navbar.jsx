import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Dialog from '@mui/material/Dialog';

import Logo from '../../Assets/mainvrame.png';

import Login from '../Forms/Login';
import Register from '../Forms/Register';

import './Navbar.css';


const Navbar = () => {

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    //Login Modal
    const openLogin = ()=>{
        setLogin(true);
    }

    const closeLogin = ()=>{
        setLogin(false);
    }

    //Register Modal
    const openRegister = ()=>{
        setRegister(true);
    }

    const closeRegister = ()=>{
        setRegister(false);
    }

    return ( 
        <div className="nav-container">
            <div className="nav-logo">
                <img src={Logo} alt="logo" />
            </div>
            <div className="nav-content">
                <div className="login">
                <Button variant="primary" className="login-link" onClick={openLogin} >Login</Button> 
                </div>
                <div className="register">
                    <Button variant="primary" className="register-link" onClick={openRegister}>Register</Button> 
                </div>
            </div>

            <Dialog open={login} onClose={closeLogin}>
                <Login />
            </Dialog>


            <Dialog open={register} onClose={closeRegister}>
                <Register />
            </Dialog>

        </div>
     );
}
 
export default Navbar;