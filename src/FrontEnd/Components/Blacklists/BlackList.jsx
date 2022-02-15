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


import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import ActionDialog from "../Dialog/ActionDialog";


const BlackList = ({user, refresh}) => {

    const [showblacklist, setShowBlacklist] = useState([]);
    const [frienddetails , setFriendDetails] = useState([]);
    
    const [name , setName] =useState(null);
    const [ID , setID] = useState(null);

    const [status, setStatus] = useState(null);
    const [message , setMessage] = useState(null);

    const [openBlacklistDialog , setOpenBlacklistDialog] = useState(false);

    const handleOpenBlacklist = (id, name)=>{
        setOpenBlacklistDialog(true);
        setName(name);
        setID(id);
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
            setOpenSnackbar(true);
            setMessage(response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 1000);
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }
        })
    }

      /*Check User is online or not and append it on friendDetails array */
    const checkOnline = async () =>{  
        const request =  showblacklist.forEach((key, index)=>{
          axios.get(`${localStorage.getItem('url')}/online/checkstatus/${key.Username}`)
          .then((response)=>{
            // console.log(response.data)
            // console.log(index)
            setFriendDetails(prevState => [...prevState , {...key , ...response.data}])
          }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }
          })
        })
        return await request
    }
      
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
                    <MenuItem onClick={(event)=> { event.stopPropagation(); handleOpenBlacklist(id, name)}}>Cancel Blacklist</MenuItem>
                </Menu>
            </>
        )
    }

    useEffect(()=>{
        user.Blacklist.forEach((key, index)=>{
            axios.get(`${localStorage.getItem('url')}/user/getfriend/${key._id}`)
            .then((response)=>{
                setShowBlacklist(prevState => [ ...prevState , response.data.response])
            }).catch((err)=>{
                if(err.response.status === 401){               
                    if(err.response.data.message === "Access Token Expired"){
                        refresh()
                    }
                }else{
                    console.log(err.response);
                }
            })
        
        })
     // eslint-disable-next-line
    },[user])
    

    useEffect( ()=>{
        axios.get(`${localStorage.getItem('url')}/user/countblacklist`,{
            headers :{
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(showblacklist.length === response.data.count){
                checkOnline()
            }
        }).catch((err)=>{
            if(err.response.status === 401){               
                if(err.response.data.message === "Access Token Expired"){
                    refresh()
                }
            }
        })
         // eslint-disable-next-line
    }, [showblacklist, refresh])


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
                <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                    <Alert severity="success">{`${message}`}</Alert>
                </Snackbar>
            }
            {frienddetails.map((key, index)=>{
                return(
                    <div className="friends-card" key={index} onClick={()=>{window.location.href=`/users/${key.Username}`}}>
                        <div className="friends-avatar">
                            <div className="friends-avatar-container" style={{ borderColor :  key.Online === "hidden" ? "grey" : key.Online ? "green" : "red" }}>
                                <img src={`${localStorage.getItem('url')}/user/getavatar/${key._id}`} alt="avatar" />
                            </div>
                        </div>
                        <div className="friends-name">
                            {key.Name}
                        </div>
                        <div className="friends-action">
                            <Stack spacing={1} direction="row">
                                <div className="friends-reverse">
                                    <IconButton
                                        size="medium"
                                        edge="start"
                                        color="success"
                                        aria-label="open drawer"
                                        sx={{
                                            mr:{
                                                sm : '20px',
                                                xs : '10px'
                                            },
                                            
                                        }}
                                        onClick={(event)=> {
                                            event.stopPropagation()
                                            handleOpenBlacklist(key._id , key.Name)
                                        }}
                                        title="Cancel Blacklist"
                                    >
                                        
                                        <CheckCircleOutlineIcon id="action-icon-reverse" />
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

            {/* Open Blacklist Dialog */}
            <ActionDialog open={openBlacklistDialog} handleClose={handleCloseBlacklist} message={`Do you want to Cancel Blacklist on ${name} ?`} action={()=>{reverseBlacklist(ID)}}/>
           
        </>
     );
}
 
export default BlackList;