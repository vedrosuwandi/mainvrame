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
import Alert from '@mui/material/Alert';
// import TextField from '@mui/material/TextField';

import AddPhoto from '@mui/icons-material/AddAPhoto';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

import Navbar from '../Components/Header/Navbar';

import ProfileDetails from '../Components/Profile/ProfileDetails';
import FriendList from '../Components/Profile/FriendList';

import '../Style/Profile.css';
import Cookies from 'js-cookie';
import ChangeDialog from '../Components/Dialog/ChangeDialog';
import OnlineError from '../Components/Dialog/OnlineErrorDialog';

 // eslint-disable-next-line
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
            <Box sx={{ p: 0 }}>
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
  

const Profile = ({refresh, user, logout}) => {

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
    
     //Open Dialog handler when Another User is logged In
    const [openAlert, setOpenAlert] = useState(false);

    const handleOpenAlert = () => {
        setOpenAlert(true);
    };
    
    const handleCloseAlert = () => {
        setOpenAlert(false);
        logout();
    };

    // Open and Close Function of the Dialog
    const handleOpen = () =>{
        axios.get(`${localStorage.getItem("url")}/online/checktoken` , {
            headers :{
                Authorization : 'Bearer ' + localStorage.getItem('refreshToken')
            }
        }).then(()=>{
            setOpen(true);  
        }).catch((err)=>{
            // open the online error dialog
            if(err.response.status === 401){
                handleOpenAlert();
            }else{
                console.log(err.response);
            }
        })
    }

    const handleClose = () => {
        setOpen(false);
    };


    //Changes Password Function
    const changePass = async (event)=>{
        event.preventDefault();
        if(password !== confirmPass){
            setChangedStat("Password Does not Not Match");
            setIsChanged(false);
        }else if(oldPassword === ""){
            setChangedStat("Please enter old password")
            setIsChanged(false)
        }else{
            await axios.post(`${localStorage.getItem("url")}/user/changepass` , {
                OldPassword : oldPassword,
                Password : password
                
            },{
                headers : {
                    Authorization : "Bearer " + Cookies.get('token')
                },
            }).then((response)=>{
                
                setChangedStat("Password Changed");
                setIsChanged(true);

                //Reset Textfields
                setOldPassword("");
                setPassword("");
                setConfirmPass("");

                setTimeout(()=>{
                    setIsChanged(null);
                    handleClose()
                },1000)
            
            }).catch((err)=>{
                if(err.response.status === 401){
                    setChangedStat("Old Password Incorrect");
                    setIsChanged(false);
                }else{
                    console.log(err.response);
                }
            })
        }
    }

    //currency
    const [currency , setCurrency] = useState();

    /*Use Effect */
    useEffect(()=>{
        //Check if the access token is exist
        if(localStorage.getItem("refreshToken") == null){
            window.location.href="/"
        }else{
            // get user currency
            axios.get(`${localStorage.getItem('url')}/user/getcurrency`, {
                headers : {
                    Authorization : "Bearer " + Cookies.get('token')
                }
            })
            .then((response)=>{
                setCurrency(response.data.currency);
            }).catch((err)=>{
                if(err.response.status === 401){
                    if(err.response.data.message === "Access Token Expired"){
                        refresh()
                    }
                }else{
                    console.log(err.response);
                }
            })
        }
        // console.log(user);
    },[refresh])
    

    // Profile Tab
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //Avatar Image alert
    const [alert , setAlert] = useState(null);
    const [profileChanged , setProfileChanged] = useState(null);

    //Upload Avatar Image 
    const uploadImage = (file)=>{
        axios.get(`${localStorage.getItem("url")}/online/checktoken` , {
            headers :{
                Authorization : 'Bearer ' + localStorage.getItem('refreshToken')
            }
        }).then((response)=>{
            axios.post(`${localStorage.getItem("url")}/user/uploadavatar/${user._id}`, file ,{
                headers : {
                    'Content-Type': 'multipart/form-data',
                    Authorization : 'Bearer ' + Cookies.get('token')
                }
            }).then((response)=>{
                setAlert(response.data.message);
                setProfileChanged(true);
                setTimeout(()=>{
                    window.location.reload()
                },(500))
                
            }).catch((err)=>{
                if(err.response.status === 401){
                    if(err.response.data.message === "Access Token Expired"){
                        refresh();
                    }
                }else if(err.response.status === 404 || err.response.status === 413 || err.response.status === 500){
                    setAlert(err.response.data.message);
                    setProfileChanged(false);
                    setTimeout(()=>{
                        setProfileChanged(null);
                     },(1000))
                }else{
                    console.log(err.response);
                }
            })
        }).catch((err)=>{
            // open the online error dialog
            if(err.response.status === 401){
                handleOpenAlert();
            }else{
                console.log(err.response);
            }
        })
    }
   
    const uploadBanner = (file)=>{
        axios.get(`${localStorage.getItem('url')}/online/checktoken` , {
            headers : {
                Authorization : 'Bearer ' + localStorage.getItem('refreshToken')
            }
        }).then((response)=>{
            axios.post(`${localStorage.getItem("url")}/user/uploadbanner/${user._id}`, file, {
                headers : {
                    'Content-Type': 'multipart/form-data',
                    Authorization : "Bearer " + Cookies.get('token')
                }
            }).then((response)=>{
                setAlert(response.data.message);
                setProfileChanged(true);
                setTimeout(()=>{
                    window.location.reload()
                },(500))
            
            }).catch((err)=>{
                if(err.response.status === 401){
                    if(err.response.data.message === "Access Token Expired"){
                        refresh();
                    }
                }else if(err.response.status === 404 || err.response.status === 413 || err.response.status === 500){
                    setAlert(err.response.data.message);
                    setProfileChanged(false);
                    setTimeout(()=>{
                        setProfileChanged(null);
                     },(1000))
                }else{
                    console.log(err.response);
                }
            })
        }).catch((err)=>{
            if(err.response.status === 401){
                handleOpenAlert();
            }else{
                console.log(err.response);
            }
        })
    }
    

    // create the form data which serve as the body
    const formData = new FormData();

    // when the user upload the image
    const fileChange = (event)=>{
        //append new form data and update the image from the database
        formData.append('file' , event.target.files[0]);
        uploadImage(formData);
    }

    const bannerChange = (event)=>{
        formData.append('banner' , event.target.files[0]);
        uploadBanner(formData);
    }


    
    //Edit Name
    const [ChangeName, setChangeName] = useState()
    const editName = (event)=>{
        setChangeName(event.target.value)
    }
    
    const [isNameEdit , setIsNameEdit] = useState(false)

    const openNameEdit = ()=>{
        setChangeName(user.Name)
        setIsNameEdit(true);
    }

    const closeNameEdit = ()=>{
        setIsNameEdit(false);
    }

    const updateName = ()=>{
        if(ChangeName === ""){
            setProfileChanged(false);
            setAlert("Name should not be empty");
            setTimeout(()=>{
                setProfileChanged(null);
            }, 1000)
        }else if(ChangeName === user.Name){
            setProfileChanged(false);
            setAlert("This Name is the same as the previous name");
            setTimeout(()=>{
                setProfileChanged(null);
            }, 1000)
        }else{
            axios.post(`${localStorage.getItem('url')}/user/changename` , {
                Name : ChangeName
            },{
                headers : {
                    Authorization : "Bearer " + Cookies.get('token')
                }
            }).then((response)=>{
                setProfileChanged(true);
                setAlert(response.data.message);
                setTimeout(()=>{
                    window.location.reload()
                },1000)

            }).catch((err)=>{
                if(err.response.status === 422){
                    setProfileChanged(false);
                    setAlert(err.response.data.message);
                    setTimeout(()=>{
                        setProfileChanged(null)
                    },1000)
                }else if(err.response.status === 401){
                    if(err.response.data.message === "Access Token Expired"){
                        refresh();
                    }
                }else{
                    console.log(err.response);
                }
            })
        }
    }
   
  

    // To prevent Error when retrieving Nested Document
    if(!user.Contact){
        return null;
    }



    return (
        <div className="profile-container">
            <div className="profile-wrapper" >
                <div className="profile-header" style={{position : 'sticky', zIndex : '5', width : '100%', top:'0'}}>
                    <div className="profile-proflechanged-alert" style={{position : "absolute", width:"100%", zIndex:"5"}}>
                        { 
                        profileChanged === null ? 
                        <></>
                        :
                        profileChanged ? 
                            <Alert severity="success">{alert}</Alert>
                        :
                            <Alert severity="error">{alert}</Alert>
                        }
                    </div>
                    <div className="profile-nav">
                        <Navbar user={user} logout={logout} showSearchbar={true} />
                    </div>
                </div>
                <div className="profile-pic">
                    <div className="profile-image">
                        <form>
                            <label htmlFor="banner-upload" className="custom-banner-upload fas">
                                <img for="banner-upload" src={`http://localhost:3003/user/getbanner/${user._id}`} alt="banner-img" />
                                <div className="banner-upload-submit">
                                    <input accept="image/*" name="banner" id="banner-upload" type="file" onChange={bannerChange} />
                                    <IconButton color="primary"  component="span"> 
                                        <AddPhoto />
                                    </IconButton>
                                </div>
                            </label>
                        </form>
                    </div>
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-image">
                            <form className="custom-avatar-form" id="change-avatar-form">
                                <label htmlFor="avatar-upload" className="custom-avatar-upload fas">
                                    <div className="avatar-wrap" >
                                        <div className="avatar-upload">
                                            <EditIcon fontSize="large" />
                                        </div>
                                        <img for="avatar-upload" src={user.Avatar?.GoogleAvatar ? user.Avatar.GoogleAvatar : `http://localhost:3003/user/getavatar/${user._id}`} alt="avatar" />
                                    </div>
                                    <input id="avatar-upload" name="file" type="file" onChange={fileChange}/> 
                                </label>
                            </form>
                        </div>
                        <div className="profile-content">
                            <div className="profile-name">
                                {
                                    isNameEdit ? 
                                    <input value={ChangeName} onChange={editName} required/>
                                    :
                                    <h1>{user.Name}</h1> 
                                }
                                <div className="profile-name-edit">
                                    {
                                        isNameEdit ? 
                                        <>
                                            <IconButton onClick={updateName}>
                                                <CheckIcon color="success" />
                                            </IconButton>

                                            <IconButton onClick={closeNameEdit}>
                                                <DoNotDisturbIcon  color="error" />
                                            </IconButton>
                                        </>
                                        :
                                        <IconButton  onClick={openNameEdit}>
                                            <BorderColorIcon  />
                                        </IconButton>
                                    }
                                </div>
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
                        {
                            isNameEdit ? 
                            <input value={ChangeName} onChange={editName} required/>
                            :
                            <h4>{user.Name}</h4> 
                        }
                        <div className="profile-name-edit">
                            {
                                isNameEdit ? 
                                <>
                                    <IconButton size="small" onClick={updateName}>
                                        <CheckIcon fontSize='small' color="success" />
                                    </IconButton>

                                    <IconButton size="small" onClick={closeNameEdit}>
                                        <DoNotDisturbIcon fontSize='small' color="error" />
                                    </IconButton>
                                </>
                                :
                                <IconButton size="small" onClick={openNameEdit}>
                                    <BorderColorIcon fontSize='small' />
                                </IconButton>
                            }
                        </div>
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
                            <ProfileDetails user={user} logout={logout} changePass={handleOpen} setProfileChanged={setProfileChanged} setAlert={setAlert}/>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <FriendList user={user} refresh={refresh} />
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
                refresh={refresh}
            />
            <OnlineError open={openAlert} handleClose={handleCloseAlert} />
        </div>
    )
}

export default Profile
