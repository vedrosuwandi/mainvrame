import React, {useState, useEffect} from 'react';
import axios from 'axios';

import {Button} from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import AddPhoto from '@mui/icons-material/AddAPhoto';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';


import Avatar from '../Assets/avatar.png';
import Navbar from '../Components/Header/Navbar';

import ProfileDetails from '../Components/Profile/ProfileDetails';

import '../Style/Profile.css';
import Cookies from 'js-cookie';
import ChangeDialog from '../Components/Dialog/ChangeDialog';

const Input = styled('input')({
    display: 'none',
  });


  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
};
}
  

const Profile = ({ processCurrency, user, logout}) => {

    // Change Password
    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass , setConfirmPass] = useState("");
    const [isChanged , setIsChanged] = useState(null);
    const [changedStat , setChangedStat] = useState("");

    const handleOldPassword = (event)=>{
        setOldPassword(event.target.value);
    }

    const handlePassword = (event)=>{
        setPassword(event.target.value);
    }

    const handleConfirmPassword = (event)=>{
        setConfirmPass(event.target.value);
    }

    // Open and Close Function of the Dialog
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };


    const changePass = async (event)=>{
        event.preventDefault();
        if(password !== confirmPass){
            setChangedStat("Password Does not Not Match");
            setIsChanged(false);
        }else if(oldPassword === ""){
            setChangedStat("Please enter old password")
            setIsChanged(false)
        }else{
            await axios.post('http://localhost:3003/user/changepass' , {
                OldPassword : oldPassword,
                Password : password
                
            },{
                headers : {
                    Authorization : "Bearer " + Cookies.get('token')
                },
            }).then((response)=>{
               if(!response.data.changed){
                    setChangedStat("Old Password Incorrect");
                    setIsChanged(false);
               }else{
                    setChangedStat("Password Changed");
                    setIsChanged(true);
                    setOldPassword("");
                    setPassword("");
                    setConfirmPass("");
                    setTimeout(()=>{
                        setIsChanged(null);
                        handleClose()
                    },1000)
               }
            }).catch((err)=>{
                console.log(err);
            })
        }
    }

    //currency
    const [currency , setCurrency] = useState();

    useEffect(()=>{
        //Check if the access token is exist
        if(localStorage.getItem("refreshToken") == null){
            alert("Please Login");
            window.location.href="/"
        }else{
            // get user currency
            axios.get('http://localhost:3003/user/getcurrency', {
                headers : {
                    Authorization : "Bearer " + Cookies.get('token')
                }
            })
            .then((response)=>{
                setCurrency(response.data.currency);
            }).catch((err)=>{
                console.log(err.message);
            })
        }
        // console.log(user);
    },[currency])

    // Profile Tab
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // To prevent Error when retrieving Nested Document
    if(!user.Contact){
        return null;
    }
      
    
    
    return (
        <div className="profile-container" >
            <div className="profile-wrapper">
                <div className="profile-header">
                    <div className="profile-nav">
                        <Navbar user={user} logout={logout} />
                    </div>
                    <div className="profile-mobile">
                        <div className="profile-back">
                            <Button id="back-button" href="/dashboard">
                                &larr;
                            </Button>
                        </div>
                        <div className="profile-omnivr" >
                            OMNI
                            <span>
                                VR 
                            </span>
                        </div>
                    </div>
                </div>
                <div className="profile-pic">
                    <div className="profile-image">
                        
                    </div>
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-image">
                            <div className="profile-avatar">
                                <img src={Avatar} alt="avatar" />
                            </div>
                            <div className="profile-change-avatar">
                                <label htmlFor="icon-button-file">
                                    <Input accept="image/*" id="icon-button-file" type="file" />
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <AddPhoto fontSize="medium" style={{fill: "white"}} />
                                    </IconButton>
                                </label>
                            </div>
                        </div>
                        <div className="profile-content">
                            <div className="profile-name">
                                <h1>{user.Name}</h1> 
                            </div>
                            <div className="profile-currency">
                                <AttachMoneyIcon fontSize="small" style={{fill: "orange"}} />
                                <p> {currency}</p>
                                <Button id="topup-button" size="sm">
                                    Top-Up
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-content-mobile">
                    <div className="profile-name-mobile">
                        <h1>{user.Name}</h1> 
                    </div>
                    <div className="profile-currency-mobile">
                        <AttachMoneyIcon fontSize="small" style={{fill: "orange"}} />
                        <p> {currency} </p>
                        <Button id="topup-button" size="sm">
                            Top-Up
                        </Button>
                    </div>
                </div>
                <div className="profile-choice">
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="full width tabs example">
                                <Tab label="Profile" {...a11yProps(0)} sx={{ flex:1 }} />
                                <Tab label="Friend List" {...a11yProps(1)} sx={{ flex:1 }} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            {/* {user.Username} */}
                            <ProfileDetails user={user} logout={logout} changePass={handleOpen} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            
                        </TabPanel>
                    </Box>
                </div>
            </div>
            <ChangeDialog 
                open={open} 
                close={handleClose} 
                isChanged={isChanged} 
                changedStat={changedStat} 
                oldPassword={oldPassword} 
                handleOldPassword={handleOldPassword} 
                password={password} 
                handlePassword={handlePassword} 
                confirmPass={confirmPass} 
                handleConfirmPassword={handleConfirmPassword} 
                changePass={changePass}
            />
        </div>
    )
}

export default Profile
