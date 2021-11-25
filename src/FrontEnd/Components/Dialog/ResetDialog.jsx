import React from 'react';

import {Button} from 'react-bootstrap';
import TextField  from '@mui/material/TextField';
import { Typography } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const ResetDialog = ({open, close, email, handleEmail, isExist, sendlink}) => {

      
    return ( 
        <>
            <Dialog open={open} onClose={close}>
                <DialogTitle>Reset Password</DialogTitle>

                <DialogContent style={{paddingBottom: 0}}>
                    <DialogContentText>
                        Please enter Your email to get the password reset link
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        variant="standard"
                        onChange={handleEmail}
                        value={email}
                        required
                        fullWidth
                    />
                    <Typography component="p" style={{color : isExist ? "green": "red" , fontSize:"13px"}}>
                        {
                            isExist === null ?
                            " "
                            :
                            isExist ? 
                            "Link has been sent to your email"
                            :
                            email === "" ?
                            "Please insert email"
                            :
                            "User does not exist"
                        }
    
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button onClick={sendlink} >Reset Password</Button>
                </DialogActions>
                
            </Dialog>
        </>
     );
}
 
export default ResetDialog;