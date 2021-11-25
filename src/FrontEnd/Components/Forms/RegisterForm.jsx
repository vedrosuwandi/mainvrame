import React, {useState} from 'react'
import {Button, Form} from 'react-bootstrap';
import Axios from 'axios';

import TextField  from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@material-ui/core';
import * as Icons from 'react-icons/ai'

import './RegisterForm.css';

const Register = () => {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");   
    const [repassword, setRePass] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    //Password Toogle
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);


    const handleName = (event)=>{
        setName(event.target.value);
    }

    const handleUsername = (event)=>{
        setUsername(event.target.value);
    }

    const handlePassword = (event) =>{
        setPassword(event.target.value);
    }

    const handleRePass = (event) =>{
        setRePass(event.target.value);
    }

    const handleEmail = (event) =>{
        setEmail(event.target.value);
    }

    const handlePhone = (event) =>{
        setPhone(event.target.value);
    }

    const [isValid , setValid] = useState();
    const [errorMessage , setErrorMessage] = useState("");

    const register = (event)=>{
        event.preventDefault();
        if(password !== repassword){
            setValid(false);
            setErrorMessage("Password does not Match");
        }else{
            Axios.post("http://localhost:3003/auth/register" , {
                "Name" : name,
                "Username" : username,
                "Password" : password,
                "Email" : email,
                "Phone" : phone
            }).then((response)=>{
                if("message" in response.data){
                    setValid(false);
                    setErrorMessage(response.data.message);
                }else if("success" in response.data){
                    setValid(true);
                    window.location.href = `/verify/${response.data.user._id}`;
                }
            })
        }
    }

    return ( 
        <div className="registerform-container">
            <div className="registerform-wrapper">
                <div className="registerform-form">
                    <Form onSubmit={register}>
                        <TextField id="filled" style={{backgroundColor: 'white'}}  label="Name" variant="filled" type="text" value={name} onChange={handleName} fullWidth required />
                        <TextField id="filled" style={{backgroundColor: 'white'}}  className="mt-2"  label="Username" type="text" variant="filled" value={username}  onChange={handleUsername} fullWidth required />
                        <TextField id="filled" style={{backgroundColor: 'white'}} className="mt-2"  label="Email" type="email" variant="filled" value={email} onChange={handleEmail} fullWidth required />
                        <div className="password-field mt-2" >
                            <TextField id="filled" label="Password" value={password} onChange={handlePassword} variant="filled" style ={{width: '50%', backgroundColor: 'white'}} required 
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
                            <TextField id="filled" className="ml-1" value={repassword} label="Confirm Password"  onChange={handleRePass} variant="filled" style ={{width: '50%', backgroundColor: 'white'}} required 
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
                        </div>
                        <TextField id="filled" style={{backgroundColor: 'white'}}  className="mt-2"  label="Phone" type="text" variant="filled" value={phone}  onChange={handlePhone} fullWidth required />
                        <Button variant="primary" id="registerform-submit" className="mt-4 col-12" type="submit">
                            Register
                        </Button>
                    </Form>
                </div>
                <div className="registerform-alert">
                    {
                        isValid ?
                        <p style={{color:"green"}}>You Have Successfully Registered an Account</p>
                        :
                        <p>{errorMessage}</p>
                    }
                </div>
                <div className="registerform-login">
                    <p>
                        Already Have an Account? &nbsp;
                        <span>
                            <a href="/login">Login Here</a>
                        </span>
                    </p>
                </div>
                <footer className="registerform-back">
                    <Button id="back-button" href="/">
                        &larr; Back to Home
                    </Button>
                </footer>
            </div>
        </div>
     );
}
 
export default Register;