import {useEffect , useState} from 'react';
import axios from 'axios';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputCode from "react-input-verification-code";
import Alert from '@mui/material/Alert';

import './ChangeEmailVerification.css';
import Cookies from 'js-cookie';

const ChangeEmailVerification = ({ open,  handleClose, email }) => {

    const [alert, setAlert] = useState(null);
    const [alertText , setAlertText] = useState();

    const [enableresend , setenableresend] = useState(false);
    let [count , setCount] = useState();
    
    const [code, setCode] = useState();

    
    useEffect(()=>{
        if(open){
            sendVerifyEmail(email);
        }
    },[open, email])

    useEffect(()=>{
        if(count > 0){
            var timer = setTimeout(()=>{
                setCount(count-1);
            },1000);
        }else{
            clearTimeout(timer)
            setenableresend(true)
        }
    },[count])

   
    const UpdateEmail = () =>{
        axios.post(`${localStorage.getItem('localhost')}/user/changeemail` , {
            Email : email,
            Code : code,
        },{
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(!response.data.success){
                setAlert(false);
                setAlertText(response.data.message);
            }else{
                setAlert(true);
                setAlertText(response.data.message);
                window.location.reload();
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

  
    /*Send Email and Verify*/
    const sendVerifyEmail = (email) =>{
        axios.post(`${localStorage.getItem('localhost')}/verify/changeemailcode`, {
            Email : email
        }).then((response)=>{
            setCount(30)
            setenableresend(false);
        }).catch((err)=>{
            console.log(err.message)
        })
    }

    return ( 
        <>
        <Dialog open={open} onClose={handleClose}>
                {
                    alert === null ?
                    <> </>
                    :
                    alert ? 
                    <Alert severity="success">{alertText}</Alert>
                    :
                    <Alert severity="error">{alertText}</Alert>
                }
                <DialogTitle  style={{display: "flex" , justifyContent:"space-between" , alignItems:"center"}}>
                    Verify Your Email
                    <div className="timer">
                        <p style={{color:"grey", fontSize:"12px"}}>{count}</p>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Verification Code has been Sent to Your Email
                    </DialogContentText>
                    <div className='emailverification-input'>
                        <InputCode length={6} autoFocus={true} value={code} onChange={setCode} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button disabled={enableresend ? false : true} onClick={()=>{sendVerifyEmail(email)}}>Resend Code</Button>
                    <Button onClick={UpdateEmail}>Submit</Button>
                </DialogActions>
            </Dialog>
        </>
     );
}
 
export default ChangeEmailVerification;