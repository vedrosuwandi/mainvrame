import React, {useState} from 'react'
import {Button, Modal, Form} from 'react-bootstrap';
import TextField  from '@mui/material/TextField';
import Axios from 'axios';

import './Register.css';

const Register = ({onClose}) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");   
    const [repassword, setRePass] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    
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

    const register = (event)=>{
        event.preventDefault();
        if(password !== repassword){
            alert("Password does not Match");
        }else{
            Axios.post("http://localhost:3003/auth/register" , {
                "Name" : name,
                "Username" : username,
                "Password" : password,
                "Email" : email,
                "Phone" : phone
            }).then((response)=>{
                if("message" in response.data){
                    alert(response.data.message);
                }else if("success" in response.data){
                    alert(response.data.success);

                    //Clear the textfield
                    setName("");
                    setUsername("");
                    setEmail("");
                    setPassword("");
                    setPhone("");
                    setRePass("");

                    // Close the Modal
                    onClose();
                }
            })
        }
    }

    return ( 
        <div>
              <Modal.Header>
                <Modal.Title>
                    Register
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={register}>
                    <TextField id="filled" label="Name" variant="filled" type="text" value={name} onChange={handleName} fullWidth />
                    <TextField id="filled" className="mt-2"  label="Username" type="text" variant="filled" value={username}  onChange={handleUsername} fullWidth />
                    <TextField id="filled" className="mt-2"  label="Email" type="email" variant="filled" value={email} onChange={handleEmail} fullWidth />
                    <TextField id="filled" className="mt-2"  label="Phone" type="text" variant="filled" value={phone}  onChange={handlePhone} fullWidth />
                    <div className="password-field mt-2" >
                        <TextField id="filled" label="Password" value={password} type="password"  onChange={handlePassword} variant="filled" style ={{width: '50%'}}  />
                        <TextField id="filled" className="ml-1" value={repassword} label="Confirm Password" type="password"  onChange={handleRePass} variant="filled" style ={{width: '50%'}} />
                    </div>
                    <Button variant="primary"  className="mt-4 col-12" type="submit">
                        Register
                    </Button>
                </Form>
            </Modal.Body>
        </div>
     );
}
 
export default Register;