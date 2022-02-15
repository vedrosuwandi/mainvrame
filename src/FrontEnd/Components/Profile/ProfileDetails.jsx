import {useState} from 'react';
import {Button} from 'react-bootstrap'
import axios from 'axios';
import Cookies from 'js-cookie';

import IconButton from '@mui/material/IconButton';
// import Alert from '@mui/material/Alert';
// import { TextField } from '@mui/material';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DatePicker from '@mui/lab/DatePicker';
// import DateAdapter from '@mui/lab/AdapterMoment';

import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CakeIcon from '@mui/icons-material/Cake';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

import './ProfileDetails.css';
import ChangeEmailVerification from '../Dialog/ChangeEmailVerification';
import ActionDialog from '../Dialog/ActionDialog';



const ProfileDetails = ({ user, logout, changePass, setProfileChanged, setAlert, refresh}) => {

    /* Change Username */
    const [isUsernameEdit , setIsUsernameEdit] = useState(false);
    const [changeUsername , setChangeUsername] = useState()

    const openUsernameEdit = ()=>{
        setChangeUsername(user.Username);
        setIsUsernameEdit(true);
    }
 
    const closeUsernameEdit = ()=>{
        setIsUsernameEdit(false);
    }
 
    const editUsername = (event)=>{
    setChangeUsername(event.target.value)
    }
 
    const updateUsername = async ()=>{
        await axios.post(`${localStorage.getItem('url')}/user/changeusername` , {
            Username : changeUsername
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            setProfileChanged(true);
            setAlert(response.data.message)
            replacetoken(response.data.newRefresh , response.data.newAccess);
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }else if(err.response.status === 409){
                // if the new username is exist on the database
                setProfileChanged(false);
                setAlert(err.response.data.message)
                setTimeout(()=>{
                    setProfileChanged(null)
                },1000)
            }else{
                console.log(err.response)
            }
        })
    }

    const replacetoken = (refresh , access)=>{
        localStorage.removeItem('refreshToken');
        localStorage.setItem('refreshToken' , refresh);
        Cookies.remove('token');
        Cookies.set('token' , access);
        setTimeout(()=>{
            window.location.reload()
        },1000)
    }


    /* Change Phone */
    const [isPhoneEdit , setIsPhoneEdit] = useState(false);
    const [changePhone, setChangePhone] = useState();

    const openPhoneEdit = ()=>{
        setChangePhone(user.Contact.Phone);
        setIsPhoneEdit(true);
    }

    const closePhoneEdit = ()=>{
        setIsPhoneEdit(false);
    }

    const editPhone = (event)=>{
        setChangePhone(event.target.value);
    }

     const updatePhone = ()=>{
        axios.post(`${localStorage.getItem('url')}/user/changephone` , {
            Phone : changePhone
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            setProfileChanged(true);
            setAlert(response.data.message);
            setTimeout(() => {
                window.location.reload()
            }, (1000));
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }else if(err.response.status === 409){
                // if the phone number is already registered on the database
                setProfileChanged(false);
                setAlert(err.response.data.message);
                setTimeout(() => {
                   setProfileChanged(null);
                }, (1000));
            }else{
                console.log(err.response);
            }
        })
    }

    /* Change Email Address */
    const [isEmailEdit , setIsEmailEdit] = useState(false);
    const [changeEmail , setChangeEmail] = useState();
    const [openVerify , setOpenVerify] = useState(false);

    const openEmailEdit = () =>{
         setChangeEmail(user.Contact.Email);
         setIsEmailEdit(true)
    }

    const closeEmailEdit = () =>{
         setIsEmailEdit(false);
    }

    const editEmail = (event) =>{
         setChangeEmail(event.target.value);
    }

    // eslint-disable-next-line
    const emailRegex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     
     
    /*Email Verification dialog*/
    const openEmailVerification = () =>{
        if(changeEmail === user.Contact.Email){
            setProfileChanged(false);
            setAlert("Please choose another email");
            setTimeout(()=>{
                setProfileChanged(null)
            },1000)
        }else if(changeEmail === ""){
            setProfileChanged(false);
            setAlert("Email Cannot be empty");
            setTimeout(()=>{
                setProfileChanged(null)
            },1000)
        }else if(!changeEmail.toLowerCase().match(emailRegex)){
            setProfileChanged(false);
            setAlert("Invalid Email Address");
            setTimeout(()=>{
                setProfileChanged(null)
            },1000)
        }else{
            axios.post(`${localStorage.getItem('url')}/user/checkemail` , {
                Email : changeEmail
            }).then((response)=>{
                if(!response.data.exists){
                    setOpenVerify(true)
                }else{
                    setProfileChanged(false);
                    setAlert("Email is Already Registered")
                    setTimeout(()=>{
                        setProfileChanged(null)
                    },1000)
                }
            }).catch((err)=>{
                if(err.response.status === 401){
                    if(err.response.data.message === "Access Token Expired"){
                        refresh();
                    }
                }else{
                    console.log(err.response);
                }
            })
        }
    }

    const closeEmailVerification = () =>{
    setOpenVerify(false)
    };

    /*Set Date of Birth */
    const [openDOB , setOpenDOB] = useState(false)
    const [dob , setDOB] = useState();

    const handleOpenDOB = () =>{
        setOpenDOB(true)
    }
    const handleCloseDOB = () =>{
        setOpenDOB(false)
    }

    const [openDOBConfirmation , setOpenDOBConfirmation] = useState(false);
    const handleOpenDOBConfirmation = () =>{
        setOpenDOBConfirmation(true)
    }
    const handleCloseDOBConfirmation = () =>{
        setOpenDOBConfirmation(false)
    }

    const addDOB = ()=>{
        console.log(dob)
    }

    const getDate = (time) =>{
        let months =[
            "January","February","March","April",
            "May","June","July","August",
            "September", "October","November","December"
        ];
    
        const date = new Date(time).getDate().toString().padStart(2,'0');
        const month = months[(new Date(time).getMonth()).toString()];
        const year = new Date(time).getFullYear();
        return  date + ' ' + month + ' ' + year;
    }
     

    return ( 
        <div className="profiledetails-container">
            <div className="profile-proflechanged-alert" style={{position : "absolute", width:"100%", zIndex:"5"}}>
            </div>
            <div className="profiledetails-username">
                <PersonIcon style={{marginRight: "15px"}} />
                {
                    isUsernameEdit ? 
                    <input value={changeUsername} onChange={editUsername} required/>
                    :
                    <> {user.Username} </>
                }
                <div className="profiledetails-username-edit">
                    {
                        isUsernameEdit ? 
                        <>
                            <IconButton >
                                <CheckIcon color="success" onClick={updateUsername} />
                            </IconButton>

                            <IconButton onClick={closeUsernameEdit}>
                                <DoNotDisturbIcon  color="error" />
                            </IconButton>
                        </>
                        :
                        <IconButton  onClick={openUsernameEdit}>
                            <BorderColorIcon  />
                        </IconButton>
                    }
                </div>
            </div>

            <div className="profiledetails-email">
                <EmailIcon style={{marginRight: "15px"}} />
                {
                    isEmailEdit ? 
                    <input value={changeEmail} type={"email"} onChange={editEmail} required/>
                    :
                    <> {user.Contact.Email} </>
                }
                <div className="profiledetails-email-edit">
                {
                        isEmailEdit ? 
                        <>
                            <IconButton >
                                <CheckIcon color="success" onClick={openEmailVerification} />
                            </IconButton>

                            <IconButton onClick={closeEmailEdit}>
                                <DoNotDisturbIcon  color="error" />
                            </IconButton>
                        </>
                        :
                        <IconButton onClick={openEmailEdit}>
                            <BorderColorIcon  />
                        </IconButton>
                    }
                </div>
            </div>

            <div className="profiledetails-phone">
                <PhoneIcon style={{marginRight: "15px"}} />
                {
                    isPhoneEdit ? 
                    <input value={changePhone} onChange={editPhone} required/>
                    :
                    <> {user.Contact.Phone} </>
                }
                <div className="profiledetails-phone-edit">
                   {
                        isPhoneEdit ? 
                        <>
                            <IconButton >
                                <CheckIcon color="success" onClick={updatePhone} />
                            </IconButton>

                            <IconButton onClick={closePhoneEdit}>
                                <DoNotDisturbIcon  color="error" />
                            </IconButton>
                        </>
                        :
                        <IconButton  onClick={openPhoneEdit}>
                            <BorderColorIcon  />
                        </IconButton>
                    }
                </div>
            </div>
      
            <div className="profiledetails-dob">
                <CakeIcon style={{marginRight: "15px"}} />
                {user?.DOB}
                {/*
                    user?.DOB 
                    ? 
                        getDate(user?.DOB)
                    :
                    <>
                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <DatePicker 
                                open={openDOB}
                                onOpen={handleOpenDOB}
                                onClose={handleCloseDOB}
                                disableFuture
                                openTo="year"
                                views={['year', 'month', 'day']}
                                value={dob}
                                onChange={(newValue) => {
                                    setDOB(newValue);
                                }}
                                renderInput={ (params) => 
                                    <>
                                        <TextField
                                            {...params}
                                            size="small"
                                            value={dob}
                                            label="Add birthday"
                                            variant='standard'
                                        />
                                        <Button
                                            style={{ marginLeft : '10px'}}
                                            disabled={ dob ? false : true }
                                            onClick={handleOpenDOBConfirmation}
                                        >
                                            Add Birthday
                                        </Button>
                                    </>
                                }
                            />
                        </LocalizationProvider>
                    </>
                */}
            </div>

            <footer className="profiledetails-actions">
                <div className="profiledetails-actions-wrapper">
                    <div className="profiledetails-changepass">
                        <Button id="changepass-button" onClick={changePass}>Change Password</Button>
                    </div>

                    <div className="profiledetails-logout">
                        <Button id="logout-button" variant="danger" onClick={logout}>Log Out</Button>
                    </div>
                </div>
            </footer>
            
            <ChangeEmailVerification open={openVerify} handleClose={closeEmailVerification} email={changeEmail} />
            <ActionDialog
                open={openDOBConfirmation} 
                handleClose={handleCloseDOBConfirmation} 
                message={`After the Birthday is set, it cannot be changed. Are you sure your birthday is on ${getDate(dob)}`} 
                action={addDOB} 
            />

        </div>
     );
}
 
export default ProfileDetails;