import { useEffect, useState } from "react";

import axios from 'axios';
import Cookies from "js-cookie";
import IconButton from '@mui/material/IconButton';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';

import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

import ActionDialog from "../Dialog/ActionDialog";


const FriendsList = ({user}) => {
    const [showfriends, setShowFriends] = useState([]);
    const [details , setDetails] = useState([]);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    
    const [name , setName] =useState(null);
    const [ID , setID] = useState(null);

    const [status, setStatus] = useState(null);
    const [message , setMessage] = useState(null);

    const handleClose = () => {
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

    /*Snackbar*/
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenSnackbar(false);
      };
    
    
    /*Mobile Action Menu*/
    const MenuDetail = ({id, name}) =>{
        const [anchorEl, setAnchorEl] = useState(null);
        const openMenu = Boolean(anchorEl);
        const handleOpenMenu = (event) => {
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
        };
    
        const handleCloseMenu = (event) => {
            event.stopPropagation();
            setAnchorEl(null);
        };

        return(
            <>
                <IconButton
                    id="fade-button"
                    aria-controls="fade-menu"
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleOpenMenu}
                >
                    <MoreVertOutlinedIcon /> 
                </IconButton>

                <Menu
                    id="fade-menu"
                    MenuListProps={{
                    'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={(event)=>{ event.stopPropagation(); handleOpenBlacklist(id, name)}}>Blacklist</MenuItem>
                    <MenuItem onClick={(event) =>{ event.stopPropagation(); handleOpenRemove(id , name)}}>Remove</MenuItem>
                </Menu>
            </>
        )
    }

    /* Blacklist Friend */
    const blacklist = async (id) =>{
        await axios.post(`${localStorage.getItem('localhost')}/user/blacklist/${id}`, {
            id : id
        }, {
            headers : {
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            setStatus(true);
            setOpenSnackbar(true);
            setMessage(response.data.message);
        }).catch((err)=>{
            console.log(err.message);
        })
        setTimeout(()=>{
            window.location.reload();
        }, 1000);
    }
    
    const deletefriend = ()=>{
        axios.post(`${localStorage.getItem('localhost')}/user/removefriend/${ID}`, {
            id : ID
        }, {
            headers : {
                Authorization : 'Bearer ' + Cookies.get('token')
            }
        }).then((response)=>{
            setStatus(true);
            setOpenSnackbar(true);
            setMessage(response.data.message);
            handleClose();
            setTimeout(()=>{
                window.location.reload()
            },1000)
        }).catch((err)=>{
            console.log(err.message)
        })
    }

    /* Check the user is online or not and append it on another array*/
    const checkOnline = async () =>{  
        const request =  showfriends.forEach((key, index)=>{
          axios.get(`${localStorage.getItem('localhost')}/online/checkstatus/${key.Username}`)
          .then((response)=>{
            // console.log(response.data)
            // console.log(index)
            setDetails(prevState => [...prevState , {...key , ...response.data}])
          }).catch((err)=>{
              console.log(err)
          })
        })
        return await request
    }
      

    useEffect(()=>{
        user.Friends.forEach((key, index)=>{
            if(!key.Blacklist){
                axios.get(`${localStorage.getItem('localhost')}/user/getfriend/${key._id}`)
                .then((response)=>{
                    setShowFriends(prevState => [ ...prevState , response.data.response])
                }).catch((err)=>{
                    console.log(err)
                })
            }
        })
     // eslint-disable-next-line
    },[user])
    

    useEffect(()=>{
        axios.get(`${localStorage.getItem('localhost')}/user/countblacklist`,{
            headers :{
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(showfriends.length === user.Friends.length - response.data.count){
                checkOnline()
            }
        }).catch((err)=>{
            console.log(err);
        })
         // eslint-disable-next-line
    }, [showfriends])

    return ( 
        <>
            {
                status === null ?
                <> </>
                :
                status ? 
                <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                    <Alert severity="error">{`${message}`}</Alert> 
                </Snackbar>
                :
                <Alert severity="success">{`${message}`}</Alert>
            }

                {details.map((key, index)=>{
                    return(
                        <div className="friends-card" key={index} onClick={()=>{window.location.href=`users/${key.Username}`}} >
                            <div className="friends-avatar">
                                <div className="friends-avatar-container" style={{ borderColor :  key.Online === "hidden" ? "grey" : key.Online ? "green" : "red" }}>
                                    <img src={`${localStorage.getItem('localhost')}/user/getavatar/${key._id}`} alt="avatar" />
                                </div>
                            </div>
                            <div className="friends-name">
                                {key.Name}
                            </div>
                            <div className="friends-action">
                                <Stack spacing={1} direction="row">
                                    <div className="friends-chat">
                                        <IconButton
                                            size="medium"
                                            edge="start"
                                            color="primary"
                                            aria-label="open drawer"
                                            sx={{
                                                mr:{
                                                    sm : '20px',
                                                    xs : '0px'
                                                },
                                                
                                            }}
                                            title="Chat"
                                            onClick={(event)=>{
                                                event.stopPropagation();
                                            }}
                                        >
                                            
                                            <ChatIcon id="action-icon-chat" />
                                        </IconButton>
                                    </div>
                                    <div className="friends-blacklist">
                                        <IconButton
                                            size="medium"
                                            edge="start"
                                            color="inherit"
                                            aria-label="open drawer"
                                            sx={{
                                                mr:{
                                                    sm : '20px',
                                                    xs : '0px'
                                                },
                                            }}
                                            title="Blacklist"
                                            onClick={(event) => { 
                                                event.stopPropagation();
                                                handleOpenBlacklist(key._id , key.Name)
                                            }}
                                        >
                                            <NotInterestedOutlinedIcon id="action-icon-blacklist" style={{color:"red"}} />
                                        </IconButton>
                                    </div>
                                    <div className="friends-delete">
                                        <IconButton
                                            size="medium"
                                            edge="start"
                                            color="inherit"
                                            aria-label="open drawer"
                                            sx={{
                                                mr:{
                                                    sm : '20px',
                                                    xs : '10px'
                                                },
                                            }}
                                            title="Remove Friend"
                                            onClick={(event) =>{
                                                event.stopPropagation();
                                                handleOpenRemove(key._id , key.Name)
                                            }}
                                        >
                                            <DeleteIcon id="action-icon-delete" style={{color:"red"}} />
                                        </IconButton>
                                    </div>
                                </Stack>
                            </div>
                            <div className="friends-action-mobile">
                                <MenuDetail id={key._id} name={key.Name}/>
                            </div>
                        </div>
                    )
                })}
            {/* Dialog for Blacklist */}
            <ActionDialog open={openBlacklistDialog} handleClose={handleCloseBlacklist} message={`Do you want to Blacklist ${name}`} action={()=>blacklist(ID)} />
            {/* Dialog for Remove */}
            <ActionDialog open={openDeleteDialog} handleClose={handleClose} message={`Are you sure want to remove ${name} from your friend list`} action={deletefriend} />
        </>
     );
}
 
export default FriendsList;