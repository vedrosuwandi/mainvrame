import React , {useState} from 'react'
import {Form, Button, InputGroup} from 'react-bootstrap';
import './Register.css';
import * as Icons from 'react-icons/fa';

const Register = () => {
    const [isVisible, setVisibility] = useState(false);

    const visible = () =>{
        setVisibility(!isVisible);
    }

    return (
        <div className="register-content">
            {/* <h1 className="register-title">
                Daftar
            </h1> */}
            <Form data-ms-form="signup" className="register-form">
                <Form.Group className="col-7 mb-1" controlId="formBasicName">
                    <Form.Control size="sm" className="name-input" type="text" placeholder="Nama" data-ms-member="name" required />
                </Form.Group>

                <Form.Group className="col-7 mb-1" controlId="RegisterformBasicEmail">
                    <Form.Control size="sm" className="email-input" type="email" placeholder="example@email.com" data-ms-member="email" required/>
                </Form.Group>

                <Form.Group className="col-7 mb-1" controlId="RegisterformBasicPassword">
                    <InputGroup>
                        <Form.Control size="sm" className="pass-input" type={isVisible? 'text' : 'password'} placeholder="Password" data-ms-member="password" required/>
                        <InputGroup.Prepend className="mt-2" onClick={visible}>
                            <InputGroup.Text className="visible" style={{padding:"14px" , borderBottom:"1px solid black" , backgroundColor:"#eee"}}>
                            {isVisible ? <Icons.FaEye /> :<Icons.FaEyeSlash />} 
                            </InputGroup.Text>
                        </InputGroup.Prepend>  
                    </InputGroup>
                </Form.Group>

                <Form.Group className="col-7 mb-1" controlId="RegisterformBasicDateofBirth">
                    <Form.Control size="sm" className="DOB-input" type="text" data-ms-member="date-of-birth" placeholder="Tanggal Lahir (DD/MM/YYYY)" required/>
                </Form.Group>

                <Form.Group className="mb-1" controlId="RegisterformBasicCheckbox">
                    <Form.Check className="loket-input" type="checkbox" data-ms-member="loketcom-newsletter" label="Saya bersedia menerima promosi berkala dari Loket.com." />
                </Form.Group>
                <Button className="signup-button" variant="primary" type="submit" >
                    Daftar
                </Button>
                <p className="policy">
                    Dengan mendaftar, kamu menyetujui 
                    <span> <a href="/" style={{color:"blue"}}>Syarat Layanan</a> </span>
                    dan 
                    <span> <a href="/" style={{color:"blue"}}>Kebijakan Privasi</a> </span>
                    kami.
                </p>
            </Form>
        </div>
    )
}

export default Register
