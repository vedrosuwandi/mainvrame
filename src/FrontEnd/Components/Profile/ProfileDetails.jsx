import {useState} from 'react';
import {Button} from 'react-bootstrap'
import axios from 'axios';
import Cookies from 'js-cookie';

import IconButton from '@mui/material/IconButton';
// import Alert from '@mui/material/Alert';

import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

import './ProfileDetails.css';
import ChangeEmailVerification from '../Dialog/ChangeEmailVerification';



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
        await axios.post(`${localStorage.getItem('localhost')}/user/changeusername` , {
            Username : changeUsername
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(!response.data.success){
                setProfileChanged(false);
                setAlert(response.data.message)
                setTimeout(()=>{
                    setProfileChanged(null)
                },1000)
            }else{
                setProfileChanged(true);
                setAlert(response.data.message)
                replacetoken(response.data.newRefresh , response.data.newAccess)
            }
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
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
        axios.post(`${localStorage.getItem('localhost')}/user/changephone` , {
            Phone : changePhone
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(!response.data.success){
                setProfileChanged(false);
                setAlert(response.data.message);
                setTimeout(() => {
                   setProfileChanged(null);
                }, (1000));
            }else{
                setProfileChanged(true);
                setAlert(response.data.message);
                setTimeout(() => {
                    window.location.reload()
                }, (1000));
            }
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
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
            axios.post(`${localStorage.getItem('localhost')}/user/checkemail` , {
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
                }
            })
        }
     }

     const closeEmailVerification = () =>{
        setOpenVerify(false)
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
        </div>
     );
}
 
export default ProfileDetails;