import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import TextField  from '@mui/material/TextField';

import Axios from 'axios';
import Cookies from 'js-cookie';

import './LoginForm.css';


const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPassTrue , setIsPassTrue] = useState(true);

    const handleUsername = (event)=>{
        setUsername(event.target.value);
    }

    const handlePassword = (event)=>{
        setPassword(event.target.value);
    }

    

    //calls the API request (login)
    const login = async (event)=>{
        event.preventDefault();
        await Axios.post('http://localhost:3003/auth/login', {
            "Username" : username,
            "Password" : password
        }).then((response) => {
            if (!response.data.auth) {
                setIsPassTrue(false);
                return
            }else{
                setIsPassTrue(true);
                //store the token in the local storage
                Cookies.set("token" , response.data.token);
                localStorage.setItem("refreshToken" , response.data.refreshToken);
                //Go to Home page
                window.location.href='/dashboard'
            }
        })
    }
    

    return (
        <div className="loginform-container">
            <div className="loginform-wrapper">
                <div className="loginform-form">
                    <Form onSubmit={login}>
                        <TextField id="filled" style={{backgroundColor: 'white'}} size="small" label="Username" variant="filled" value={username} onChange={handleUsername} fullWidth required />
                        
                        <TextField id="filled"  style={{backgroundColor: 'white'}} className="mt-2"  size="small" label="Password"  variant="filled" value={password} type="password" onChange={handlePassword} fullWidth required/>

                        <Button variant="primary" id="loginform-submit" className="mt-4 col-12" type="submit" >
                            Login
                        </Button>
                    </Form>
                </div>
                <div className="loginform-alert">
                    {
                        isPassTrue
                        ?
                        <p></p>
                        :
                        <p>
                            Incorrect Username or Password!
                        </p>
                    }
                </div>

                <div className="loginform-register">
                    <p>Does not Have an Account? &nbsp;
                        <span>
                            <a href="/register">
                            Register Here
                            </a>
                        </span>
                    </p>
                </div>
                <div className="loginform-back">
                    <Button id="back-button" href="/">
                        &larr; Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
 
export default LoginForm;