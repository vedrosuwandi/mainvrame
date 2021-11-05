import React, {useState, useContext} from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import TextField  from '@mui/material/TextField';
import Axios from 'axios';

import { Context , userContext } from '../../Store/Store';

import './Login.css';

const Login = ({onClose}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const {state, setState} = useContext(Context);
    const {user, setUser} = useContext(userContext);
  

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
                alert("Login Failed")
                return
            } 
            //Change Login Status
            setState(response.data.auth);
            console.log(state);
            //Set the User data
            setUser(response.data.user);
            console.log(user);
            // Close the modal function
            //store the token in the local storage
            localStorage.setItem("token" , response.data.token);
            onClose();
            // window.location.href='/'
            
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