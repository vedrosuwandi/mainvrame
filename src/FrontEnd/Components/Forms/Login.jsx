import React, {useState} from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import TextField  from '@mui/material/TextField';
import Axios from 'axios';

import './Login.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStat, setStat] = useState(false);

    
    const handleUsername = (event)=>{
        setUsername(event.target.value);
    }

    const handlePassword = (event)=>{
        setPassword(event.target.value);
    }

    //calls the API request (login)
    const login = (event)=>{
        event.preventDefault();
        Axios.post('http://localhost:3003/auth/login', {
            "Username" : username,
            "Password" : password
        }).then((response)=>{
            console.log("response");
            if(!response.data.auth){
                alert("Login Failed");
                setStat(false);
            }else{
                localStorage.setItem("token" , response.data.token);
                setStat(true);
                window.location.href='/'
            }
        })
    }



    return ( 
        <div>
             <Modal.Header>
                <Modal.Title>
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={login}>
                    <TextField id="filled"  size="small" label="Username" variant="filled" value={username} onChange={handleUsername} fullWidth />
                    
                    <TextField id="filled" className="mt-2"  size="small" label="Password"  variant="filled" value={password} type="password" onChange={handlePassword} fullWidth />
                  
                       
                    <Button variant="primary"  className="mt-4 col-12" type="submit" >
                        Login
                    </Button>
            
                </Form>
            </Modal.Body>
        </div>
     );
}
 
export default Login;