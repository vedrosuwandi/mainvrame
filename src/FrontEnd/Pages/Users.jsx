import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router'
import axios from 'axios';
import Cookies from 'js-cookie';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';


import ActionDialog from "../Components/Dialog/ActionDialog";
import Navbar from '../Components/Header/Navbar';
import '../Style/Users.css'



const Users = ({user, logout}) => {
    const { username } = useParams(); 

    const [data, setData] = useState({});

    const [friendstatus , setfriendStatus] = useState({});

    const [requestalert, setrequestAlert] = useState(false);


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [name , setName] =useState(null);
    const [ID , setID] = useState(null);
    const [status, setStatus] = useState(null);
    const [message , setMessage] = useState(null);
    
    const handleCloseRemove = () => {
        setOpenDeleteDialog(false);
    };
    
    const handleOpenRemove = (id, name)=>{
        setOpenDeleteDialog(true)
        setName(name)
        setID(id)
    }

 

    const deletefriend = ()=>{
        axios.post(`${localStorage.getItem('localhost')}/user/removefriend/${ID}`, {
            id : ID
        }, {
            headers : {
                Authorization : 'Bearer ' + Cookies.get('token')
            }
        }).then((response)=>{
            setStatus(true)
            setMessage(response.data.message)
            handleCloseRemove();
            setTimeout(()=>{
                window.location.reload()
            },1000)
        }).catch((err)=>{
            console.log(err.message)
        })
    }

    useEffect(()=>{
        axios.get(`${localStorage.getItem('localhost')}/user/getdetails/${username}`)
        .then((response)=>{
            if(response.data.data !== null){
                setData(response.data.data);
                // Get friends status
                axios.get(`${localStorage.getItem('localhost')}/user/getfriendstatus/${username}` , 
                    {
                        headers : {
                            Authorization : "Bearer " + Cookies.get('token')
                        }
                    }
                )
                .then((response)=>{
                    setfriendStatus(response.data)
                }).catch((err)=>{
                    console.log(err)
                })
            }else{
                window.location.href= "/dashboard"
            }
        }).catch((err)=>{
            console.log(err)
        })
    },[username])
    

    if(!user.Contact){
        return null;
    }
    


    const friend_action = () =>{
        return(
            <Stack spacing={1} direction="row" >
                <IconButton
                    color="primary"
                    title="Chat"
                >
                    <ChatIcon />
                </IconButton>
                <IconButton
                    color="error"
                    title="Remove Friend"
                    onClick={() => handleOpenRemove(data._id, data.Name)}
                >
                    <DeleteIcon />
                </IconButton>
            </Stack>
        )
    }

    const pending_action = () =>{
        return(
            <p>Friend Request Sent</p>
        )
    }

    const notfriend_action = () =>{
        return(
            <Stack spacing={1} direction="row" >
                <IconButton
                    color="primary"
                    onClick={sendrequest}
                    title="Send Friend Request"
                >
                    <PersonAddAlt1Icon />
                </IconButton>
            </Stack>
        )
    }

    const sendrequest = () =>{
        axios.post(`${localStorage.getItem('localhost')}/user/sendrequest/${data._id}` , {
            id : data._id
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            setrequestAlert(true);
            setTimeout(()=>{
                window.location.reload()
            },1000);
        }).catch((err)=>{
            console.log(err)
        })
    }

    return (
        <div className="users-container">
            {
                status === null ?
                <> </>
                :
                status ? 
                <Alert severity="error">{`${message}`}</Alert> 
                :
                <Alert severity="success">{`${message}`}</Alert>
            }
            {
                requestalert ? 
                <Alert severity="success">Friend Request Has been sent to {data.Name}</Alert>
                :
                <></>
            }
            <div className="users-wrapper">
                <div className="users-headers">
                    <div className="users-nav">
                        <Navbar user={user} logout={logout} showSearchbar={true} />
                    </div>
                </div>
                <div className="users-pic">
                    <div className="users-banner-container">
                        <img src={`${localStorage.getItem('localhost')}/user/getbanner/${data._id}`} alt="" />
                    </div>
                    <div className="users-avatar-wrapper">
                        <div className="users-avatar-image">
                            <div className="users-avatar-wrap" >
                                <img for="avatar-upload" src={`http://localhost:3003/user/getavatar/${data._id}`} alt="avatar" />
                            </div>
                        </div>
                        <div className="users-details">
                            <div className="users-name">
                                <h1>{data.Name}</h1> 
                            </div>
                            <div className="users-actions">
                                {
                                    Boolean(friendstatus.Friends) ? 
                                        friend_action()
                                    :
                                    Boolean(friendstatus.PendingReceive) ? 
                                        pending_action()
                                    : 
                                        notfriend_action()
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="users-details-mobile">
                    <div className="users-name-mobile">
                        <h1>{data.Name}</h1> 
                    </div>
                    <div className="users-actions">
                    {
                        Boolean(friendstatus.Friends) ? 
                        friend_action()
                        :
                        Boolean(friendstatus.PendingReceive) ? 
                        pending_action()
                        : 
                        notfriend_action()
                        }
                    </div>
                </div>
            </div>

          
            {/* Remove friend Dialog */}
            <ActionDialog open={openDeleteDialog} handleClose={handleCloseRemove} message={`Are you sure want to remove ${name} from your friend list ?`} action={deletefriend} />
        </div>
    )
}

export default Users
