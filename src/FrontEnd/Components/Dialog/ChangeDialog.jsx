import React, {useState} from 'react';

import {Button} from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';

import * as Icons from 'react-icons/ai'

const ChangeDialog = ({open, close, isChanged, changedStat, oldPassword, handleOldPassword, password, handlePassword , confirmPass, handleConfirmPassword, changePass}) => {

    // Password Field Toogle
    const [showOldPassword, setShowOldPassword] = useState(false);
    const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const handleMouseDownOldPassword = () => setShowOldPassword(!showOldPassword);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const [showConfirm, setShowConfirm] = useState(false);

    const handleClickShowConfirm = () => setShowConfirm(!showConfirm);
    const handleMouseDownConfirm = () => setShowConfirm(!showConfirm);


    return ( 
        <>
            <Dialog open={open} onClose={close}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{display : isChanged === null ? "none" : "block" }}>
                        <Alert variant="filled" severity={
                            isChanged === null ?  
                            ""
                            :
                            isChanged ? 
                            "success" 
                            : 
                            "warning" 
                            }>
                            {changedStat}
                        </Alert>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Old Password"
                        fullWidth
                        variant="standard"
                        value={oldPassword}
                        onChange={handleOldPassword}
                        type={showOldPassword ? "text": "password"}
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowOldPassword}
                                onMouseDown={handleMouseDownOldPassword}
                                >
                                {showOldPassword ?  <Icons.AiFillEye /> :  <Icons.AiFillEyeInvisible />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="New Password"
                        fullWidth
                        variant="standard"
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
                    <TextField
                        margin="dense"
                        id="name"
                        label="Confirm Password"
                        fullWidth
                        variant="standard"
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <Button onClick={changePass}>Change Password</Button>
                </DialogActions>
            </Dialog>
        </>
     );
}
 
export default ChangeDialog;