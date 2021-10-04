import React, { useState } from 'react'
import {Form, Button, InputGroup} from 'react-bootstrap';
import './Login.css';
import * as Icons from 'react-icons/fa';

const Login = () => {
    const [isVisible, setVisibility] = useState(false);

    const visible = () =>{
        setVisibility(!isVisible);
    }

    return (
        <div className="login-content">
            {/* <h1 className="login-title">Masuk</h1> */}
            <Form data-ms-form="login" className="login-form" >
                <Form.Group className="col-7 mb-3" controlId="formBasicEmail">            
                    <Form.Control data-ms-member="email" className="email-input" type="email" placeholder="example@email.com" required/>
                </Form.Group>
                <Form.Group className="col-7 mb-3" controlId="formBasicPassword">
                    <InputGroup>
                        <Form.Control data-ms-member="password" className="pass-input" type={isVisible? "text" : "password"}  placeholder="Password" required/> 
                            <InputGroup.Prepend className="mt-2" onClick={visible}>
                                <InputGroup.Text className="visible" style={{padding:"15.5px" , borderBottom:"1px solid black" , backgroundColor:"#eee"}}>
                                   {isVisible ? <Icons.FaEye /> :<Icons.FaEyeSlash />} 
                                </InputGroup.Text>
                            </InputGroup.Prepend>  
                    </InputGroup>
                </Form.Group>
                <div className="login-action">
                    <Button variant="primary" className="signin-button" type="submit">
                        Masuk
                    </Button>
                    <a href="#/ms/password-reset" id="forgot">Lupa Password?</a>
                </div>
            </Form>
          
        </div>
    )
}

export default Login
