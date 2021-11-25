import React, {useEffect, useState}  from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import Alert from '@mui/material/Alert';

const Verified = () => {
    const {code} = useParams();
    const [verified, setverified] = useState();

    useEffect(()=>{
        axios.post(`http://localhost:3003/verify/${code}`)
        .then((response)=>{

            if(response.data.message === "Code Expired"){
                // alert("Link Expired, Please Generate the new one");
                setverified(false);
                return
            }
            setverified(true);
            setTimeout(()=>{
                window.location.href = "/"    
            },1500)
            // alert("Account Verified");
            // window.location.href="/";
        }).catch((err)=>{

        })
    // eslint-disable-next-line
    },[])

    return (
        <div className="verified-container">
            <div className="verified-alert">
                {verified
                ?
                <Alert severity="success">You Have Verified Your Account</Alert> 
                :
                <Alert severity="warning">Your Link is Expired. Please Relogin</Alert>
                }
            </div>
        </div>
    )
}

export default Verified
