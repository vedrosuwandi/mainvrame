import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';

import TextField  from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@material-ui/core';
import * as Icons from 'react-icons/ai';

import './LoginForm.css';
import ResetDialog from '../Dialog/ResetDialog';

const LoginForm = () => {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPassTrue , setIsPassTrue] = useState(true);
    
    //Password Toogle
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);


    const handleUsername = (event)=>{
        setUsername(event.target.value);
    }
    
    const handlePassword = (event)=>{
        setPassword(event.target.value);
    }
    
    //calls the API request (login)
    const login = async (event)=>{
        event.preventDefault();
        await axios.post(`${localStorage.getItem("localhost")}/auth/login`, {
            "Username" : username,
            "Password" : password
        }).then((response) => {
            if (!response.data.auth) {
                setIsPassTrue(false);
                if(response.data.message === "User has not Verified!"){
                    // alert("Please Verify Your Email")
                    setIsPassTrue(true);
                    console.log(response);
                    window.location.href=`verify/${response.data.user._id}`
                }
                return
            }else{
                setIsPassTrue(true);
                //store the token in the local storage
                Cookies.set("token" , response.data.token);
                localStorage.setItem("refreshToken" , response.data.refreshToken);
                //Go to Home page
                window.location.href='/dashboard';
                
            }
        })
    }



    //Forgot Password Dialog
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    
    const [email , setEmail] = useState("");
    const [isExist , setIsExist] = useState(null);

    const handleEmail = (event)=>{
        setEmail(event.target.value);
    }

    const handleClose = () => {
        setEmail("");
        setIsExist(null);
        setOpen(false);
    };

   const sendlink =  async ()=>{
        await axios.post(`${localStorage.getItem("localhost")}/user/sendlink`, {
            "Email" : email
        })
        .then((response)=>{
            // console.log(email)
            if(response.data.message === "No User found"){
                setIsExist(false);
            }else{
                setIsExist(true);
            }

        }).catch((err)=>{
            console.log(err);
        })
    }



    return (
        <div className="loginform-container">
            <div className="loginform-wrapper">
                <div className="loginform-form">
                    <Form onSubmit={login}>
                        <TextField id="filled" style={{backgroundColor: 'white'}} size="small" label="Username" variant="filled" value={username} onChange={handleUsername} fullWidth required />
                        
                        <TextField id="filled"  style={{backgroundColor: 'white'}} className="mt-2"  size="small" label="Password"  variant="filled" value={password} onChange={handlePassword} fullWidth required
                        type={showPassword ? "text": "password"}
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                >
                                {showPassword ?  <Icons.AiFillEye /> :  <Icons.AiFillEyeInvisible />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
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
                <div className="loginform-forgot">
                    <Button onClick={handleOpen}>Forgot Password</Button>
                </div>

                <div className="loginform-register">
                    <p>Does not Have an Account? 
                        <span>
                        &nbsp;
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

            <ResetDialog open={open} close={handleClose} email={email} handleEmail={handleEmail} isExist={isExist} sendlink={sendlink} />
        </div>
    );
}
 
export default LoginForm;