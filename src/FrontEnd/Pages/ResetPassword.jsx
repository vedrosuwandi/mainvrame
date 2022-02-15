import React, {useState} from 'react'
import { useParams } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import {Form} from 'react-bootstrap';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@material-ui/core';
import * as Icons from 'react-icons/ai'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert';

import '../Style/ResetPassword.css';
import axios from 'axios';

const ResetPassword = () => {
    const {code} = useParams();

    const [password , setPassword] = useState("");
    const [confirmPass , setConfirmPass] = useState("");
    
    const handlePassword = (event)=>{
        setPassword(event.target.value);
    }

    const handleConfirmPassword = (event)=>{
        setConfirmPass(event.target.value);
    }

    // Password Field Toogle
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const [showConfirm, setShowConfirm] = useState(false);

    const handleClickShowConfirm = () => setShowConfirm(!showConfirm);
    const handleMouseDownConfirm = () => setShowConfirm(!showConfirm);

    const [changed , setChanged] = useState(null);


    const resetPass = ()=>{
        if(password !== confirmPass){
            setChanged(false);
        }else{
            axios.post(`${localStorage.getItem("url")}/user/reset/${code}`,{
                "Password" : password
            })
            .then((response)=>{
                setChanged(true);
                setPassword("");
                setConfirmPass("");
            }).catch((err)=>{
                console.log(err.response);
            })
        }
    }

    return (
        <div className="reset-container">
            <div className="reset-wrapper">
                <div className="reset-title">
                    <h3>Reset Password</h3>
                </div>
                <div className="reset-alert" style={{
                    display : changed === null ?  "none" : "block"}}
                >
                    {
                        changed === null ? 
                        <></>
                        :
                        changed ? 
                        <Alert variant="filled" severity="success">
                            Your Password Has been Changed
                        </Alert>
                        : 
                        <Alert variant="filled" severity="warning">
                            Password Does Not Match
                        </Alert>
                    }
                </div>
                <div className="reset-content">
                    <Form>
                        <div className="reset-password">
                            <TextField id="filled-basic" label="Password" variant="filled" fullWidth 
                            value={password}
                            onChange={handlePassword}
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
                        <div className="reset-confirm-password">
                            <TextField id="filled-basic" label="Confirm Password" variant="filled" fullWidth 
                            value={confirmPass}
                            onChange={handleConfirmPassword}
                            type={showConfirm ? "text": "password"}
                            InputProps={{ // <-- This is where the toggle button is added.
                                 endAdornment: (
                                   <InputAdornment position="end">
                                     <IconButton
                                       aria-label="toggle password visibility"
                                       onClick={handleClickShowConfirm}
                                       onMouseDown={handleMouseDownConfirm}
                                     >
                                       {showConfirm ?  <Icons.AiFillEye /> :  <Icons.AiFillEyeInvisible />}
                                     </IconButton>
                                   </InputAdornment>
                                 )
                               }}
                            />
                        </div>
                        <div className="reset-submit">
                            <Button variant="contained" onClick={resetPass} fullWidth>Reset Password</Button>
                        </div>
                    </Form>
                </div>
                <div className="reset-back">
                    <a href="/login">&larr; Back to Login</a>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
