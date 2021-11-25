import React ,{useEffect, useState, useRef} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@material-ui/core';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import '../Style/Verify.css';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Verify = () => {
    const {id} = useParams();
    const [user, setuser] = useState({});
    const [enableSend, setEnableSend] = useState(false);
    let counting = useRef();
    let [count, setcount] = useState(30);
    
    //Modal
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const countdown = ()=>{
        counting = setInterval(()=>{
            if(count <= 0){
                setEnableSend(true);
                clearInterval(counting.current);
                // console.log(enableSend);
            }else{
                //Continue the timer
                setcount(count -= 1);
            }
        },1000)
    }

    const sendlink = ()=>{
        axios.post(`http://localhost:3003/verify/send/${id}`)
        .then((response)=>{
            // console.log(response)
        }).catch((err)=>{
            console.log(err)
        })
    }
    
    // Reload the page for re sending the link
    const reload = ()=>{
        axios.get(`http://localhost:3003/user/getstatus/${id}`)
        .then((response)=>{
            if(!response.data.user[0].Verify){
                setOpen(true);
                setTimeout(()=>{
                    window.location.reload();
                },1000)
            }else{
                window.location.href="/";
                // console.log(response.data.user[0].Verify);
            }
        }).catch((err)=>{
            console.log(err)
        })
     
    }

    useEffect(()=>{
        if(!enableSend){
            countdown()
        }else{
            return 
        }
        // get the data to do the verification
        axios.get(`http://localhost:3003/verify/${id}`)
        .then((response)=>{
            if(response.data.user.length === 0){
                window.location.href = "/";
            }else{
                // Get user data as a variable
                setuser(response.data.user[0]);
                //Send Email
                sendlink();
            }
        }).catch((err)=>{  
            console.log(err);
        })
        
     // eslint-disable-next-line
    },[])

    // To prevent Error when retrieving Nested Document 
    if(!user.Contact){
        return null;
    }  
      
    return (
        <div className="verify-container">
            <div className="verify-wrapper">
                <div className="verify-title">
                    <h3>Verify Your Email</h3>
                </div>
                <div className="verify-content">
                    We have sent the verification code to
                    <span>
                        &nbsp;{user.Contact.Email}
                    </span>
                    .
                    <br />
                    Please Check your email inbox to continue
                    <div className="verify-resend">
                        <div className="verify-timer">
                            <div className="verify-timer-content">
                                00 : {("0" + count).slice(-2)}
                            </div>
                        </div>
                        <Button onClick={reload} disabled={enableSend ? false : true} > Resend The Link </Button>
                    </div>
                    <div className="verify-return">
                        <a href="/" > I have Verify My Account </a>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Email has been Sent
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Please Check Your Inbox in your email
                </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default Verify
