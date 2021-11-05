import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {Button} from 'react-bootstrap';

import Logo from '../../Assets/mainvrame.png';

import Login from '../Forms/Login';
import Register from '../Forms/Register';


import './Navbar.css';


const Navbar = () => {

    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const [isLogin , setIsLogin] = useState(false);

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

    const logout = ()=>{
        //delete the token in the localstorage
        localStorage.removeItem("token");
        //Change login Status
        setIsLogin(false);
    }   


    return ( 
        <div className="nav-container">
            <div className="nav-logo">
                <img src={Logo} alt="logo" />
            </div>
            <div className="nav-content">
                { isLogin ?
                    <div className="nav-profile" style={{display:"flex"}}>
                        <h4>
                            Welcome,
                             {/* {data.Name} */}
                        </h4>
                        <div className="logout">
                            <Button variant="danger" className="logout-link" onClick={logout}>Logout</Button> 
                        </div>
                    </div>
                    :
                    <div className="nav-signs" style={{display:"flex"}}>
                        <div className="login">
                            <Button variant="primary" className="login-link" onClick={openLogin} >Login</Button> 
                        </div>
                        <div className="register">
                            <Button variant="primary" className="register-link" onClick={openRegister}>Register</Button> 
                        </div>
                    </div>
                }
            </div>


            {/* Login */}
            <Dialog open={login} onClose={closeLogin}>
                <Login onClose={closeLogin} />
              
            </Dialog>



            {/* Register */}
            <Dialog open={register} onClose={closeRegister}>
                <Register onClose={closeRegister} />
            </Dialog>



        </div>
     );
}
 
export default Navbar;