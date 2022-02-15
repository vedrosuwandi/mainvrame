import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router'
import axios from 'axios';
import Cookies from 'js-cookie';

import Blogs from '../Components/Users/Blogs/Blogs';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';

import ActionDialog from "../Components/Dialog/ActionDialog";
import Navbar from '../Components/Header/Navbar';
import { Divider } from '@mui/material';

import '../Style/Users.css';



const Users = ({user, logout, refresh}) => {
    const { username } = useParams(); 

    const [data, setData] = useState({});

    const [friendstatus , setfriendStatus] = useState({});

    const [requestalert, setrequestAlert] = useState(null);


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

 
    const [openBlacklistDialog, setOpenBlacklistDialog] = useState(false);

    const handleOpenBlacklist = (id, name)=>{
        setOpenBlacklistDialog(true)
        setName(name)
        setID(id)
    }

    const handleCloseBlacklist = ()=>{
        setOpenBlacklistDialog(false);
    }

    const [openReverseDialog, setOpenReverseDialog] = useState(false);

    const handleOpenReverse = (id, name)=>{
        setOpenReverseDialog(true)
        setName(name)
        setID(id)
    }

    const handleCloseReverse = ()=>{
        setOpenReverseDialog(false);
    }


    useEffect(()=>{
        axios.get(`${localStorage.getItem('url')}/user/getdetails/${username}`)
        .then((response)=>{
            if(response.data.data !== null){
                setData(response.data.data);
                // Get friends status
                
                axios.get(`${localStorage.getItem('url')}/user/getfriendstatus/${username}` , 
                    {
                        headers : {
                            Authorization : "Bearer " + Cookies.get('token')
                        }
                    }
                )
                .then((response)=>{
                    // if the user is opening their own page
                    if(Boolean(response.data.self)){
                        setfriendStatus({self : 1})
                    }else{
                        setfriendStatus(response.data)
                    }
                    
                }).catch((err)=>{
                    if(err.response.status === 401){
                        console.log(err.response)
                    }
                })
            }else{
                window.location.href= "/dashboard"
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
    },[username, refresh])
    

    if(!user.Contact){
        return null;
    }
    

    const friend_action = () =>{
        return(
            <Stack spacing={1} direction="row" >
                {
                    Boolean(friendstatus.Blacklisted)  ?
                    <IconButton
                        color="success"
                        title="Cancel Blacklist"
                        onClick={()=> handleOpenReverse(data._id, data.Name)}
                    >
                        <CheckCircleOutlineIcon />
                    </IconButton>

                    :
                    <>
                        <IconButton
                            color="primary"
                            title="Chat"
                            onClick={
                                () =>{
                                    window.location.href= "/friends/chat"
                                }
                            }
                        >
                            <ChatIcon />
                        </IconButton>

                        <IconButton
                            color="error"
                            title="Blacklist"
                            onClick={()=> handleOpenBlacklist(data._id, data.Name)}
                        >
                            <NotInterestedOutlinedIcon color="error" />
                        </IconButton>
                    </>
                }

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
                {
                    Boolean(friendstatus.Blacklisted) 
                    ?
                    <IconButton
                        color="success"
                        title="Cancel Blacklist"
                        onClick={()=> handleOpenReverse(data._id, data.Name)}
                    >
                        <CheckCircleOutlineIcon />
                    </IconButton>
                    :
                    <>
                        <IconButton
                        color="primary"
                        onClick={sendrequest}
                        title="Send Friend Request"
                        >
                            <PersonAddAlt1Icon />
                        </IconButton>

                        <IconButton
                            color="error"
                            title="Blacklist"
                            onClick={()=> handleOpenBlacklist(data._id, data.Name)}
                        >
                            <NotInterestedOutlinedIcon color="error" />
                        </IconButton>
                    </>
                }
            </Stack>
        )
    }



    const sendrequest = () =>{
        if(friendstatus.Blacklisted){
            setrequestAlert(false)
            setTimeout(()=>{
                setrequestAlert(null)
            },1000);
        }else{
            axios.post(`${localStorage.getItem('url')}/user/sendrequest/${data._id}` , {
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
                console.log(err.response)
            })
        }
    }
    
    const deletefriend = ()=>{
        axios.post(`${localStorage.getItem('url')}/user/removefriend/${ID}`, {
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
            console.log(err.response)
        })
    }

    /* Blacklist Friend */
    const blacklist = async (id) =>{
        await axios.post(`${localStorage.getItem('url')}/user/blacklist`, {
            ID : id
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            setStatus(true);
            setMessage(response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 1000);
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

    /* Cancel Blacklist Function */
    const reverseBlacklist = async (id) =>{
        await axios.post(`${localStorage.getItem('url')}/user/reverseblacklist`, {
            ID : id
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            setStatus(false);
            setMessage(response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 1000);
        }).catch((err)=>{
            console.log(err.response)
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
                requestalert === null ? 
                <></>
                :
                requestalert ? 
                <Alert severity="success">Friend Request Has been sent to {data.Name}</Alert>
                :
                <Alert severity="error">You have been blocked by {data.Name}</Alert>
            }
            <div className="users-wrapper">
                
                <div className="users-headers" style={{position : 'sticky', zIndex : '999', width : '100%', top:'0'}}>
                    <div className="users-nav">
                        <Navbar user={user} logout={logout} showSearchbar={true} />
                    </div>
                </div>
                <div className="users-pic">
                    <div className="users-banner-container">
                        <img src={`${localStorage.getItem('url')}/user/getbanner/${data._id}`} alt="" />
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
                                    Boolean(friendstatus.self) ? 
                                        <></>
                                    :
                                    Boolean(friendstatus.Blacklist)? 
                                    <></>
                                    :
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
                            Boolean(friendstatus.self) ? 
                            <></>
                            :
                            Boolean(friendstatus.Blacklist)? 
                            <></>
                            :
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
                <Divider sx={{margin : "15px 0px"}} />
                <div className="users-content-container">
                    <div className="users-content-left">

                    </div>
                    <div className="users-blogs-container">
                        <div className="users-blogs-action">
                            <div className="users-blogs-action-wrapper"  style={{display : Boolean(friendstatus.self) ? "flex" : "none" }} >
                                {
                                    Boolean(friendstatus.self) ? 
                                
                                    <Stack direction="row"  spacing={{ xs: 1, sm: 2, md: 4 }} sx={{margin : "0px 10px", borderRadius: "5px"}}
                                        onClick={()=>{
                                            window.location.href = '/posts/blog';
                                        }}
                                    >
                                        <Button variant="contained" startIcon={<PostAddIcon />}>
                                            Post
                                        </Button>
                                    </Stack>
                                    : 
                                    <></>
                                }
                            </div>
                        </div>
                        <div className="users-blogs">
                            <Blogs params={username} user={user} friendstatus={friendstatus} refresh={refresh} />
                        </div>
                    </div>
                    <div className="users-content-right">

                    </div>
                </div>
            </div>

            {/* Open Reverse Blacklist Dialog */}
            <ActionDialog open={openReverseDialog} handleClose={handleCloseReverse} message={`Do you want to Cancel Blacklist on ${name} ?`} action={()=>{reverseBlacklist(ID)}}/>           
            {/* Dialog for Blacklist */}
            <ActionDialog open={openBlacklistDialog} handleClose={handleCloseBlacklist} message={`Do you want to Blacklist ${name}`} action={()=>blacklist(ID)} />
            {/* Remove friend Dialog */}
            <ActionDialog open={openDeleteDialog} handleClose={handleCloseRemove} message={`Are you sure want to remove ${name} from your friend list ?`} action={deletefriend} />
        </div>
    )
}

export default Users
