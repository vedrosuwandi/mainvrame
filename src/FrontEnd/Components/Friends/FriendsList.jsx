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
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';

import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import SortIcon from '@mui/icons-material/Sort';

import ActionDialog from "../Dialog/ActionDialog";


const FriendsList = ({user , refresh}) => {
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
    
    /*Sort Menu*/
    const [anchorElSort, setAnchorElSort] = useState(null);
    const openSortMenu = Boolean(anchorElSort);
    const handleOpenSortMenu = (event) => {
      setAnchorElSort(event.currentTarget);
    };
    const handleCloseSortMenu = () => {
      setAnchorElSort(null);
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

    
    // const deleteConversation = (id) =>{
        
    // }


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
            }else{
                console.log(err.response);
            }
        })
    }
    
    const deletefriend = ()=>{
        axios.post(`${localStorage.getItem('url')}/user/removefriend/${ID}`, {
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
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }else{
                console.log(err.response)
            }
        })
    }

    /* Check the user is online or not and append it on another array*/
    const checkOnline = async () =>{  
        const request =  showfriends.forEach((key, index)=>{
          axios.get(`${localStorage.getItem('url')}/online/checkstatus/${key.Username}`)
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
      

    const sortFriendAsc = (key) =>{
        return (a, b) =>{
            if(a[key] > b[key]){
                return 1
            }else if(a[key] < b[key]){
                return -1
            }
        }
    }

    const sortFriendDesc = (key) =>{
        return (a, b) =>{
            if(a[key] > b[key]){
                return -1
            }else if(a[key] < b[key]){
                return 1
            }
        }
    }

    /*Paginate*/
    // How many Items in one page
    const ItemLimit = 6;
    //Current Page
    const [page, setPage] = useState(1);
   

    const changePage = (event, value)=>{
      setPage(value);
    }


    useEffect(()=>{
        user.Friends.forEach((key, index)=>{
            if(!key.Blacklist){
                axios.get(`${localStorage.getItem('url')}/user/getfriend/${key._id}`)
                .then((response)=>{
                    setShowFriends(prevState => [ ...prevState , response.data.response])
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
        })
     // eslint-disable-next-line
    },[user])
    


    useEffect(()=>{
        axios.get(`${localStorage.getItem('url')}/user/countblacklistfriend`,{
            headers :{
                Authorization : "Bearer " + Cookies.get('token')
            }
        }).then((response)=>{
            if(showfriends.length === user.Friends.length - response.data.count){
                checkOnline()
            }
        }).catch((err)=>{
            if(err.response.status === 401){
                if(err.response.data.message === "Access Token Expired"){
                    refresh();
                }
            }
        })
         // eslint-disable-next-line
    }, [showfriends])

    // Visible Paginate
    const VisiblePaginate = ()=>{
        if (details.length >= ItemLimit){
            return true
        }else{
            return false
        }
    }

    return ( 
        <>
            <div className="FriendListMenu" style={{display: "flex" , justifyContent:"flex-end"}}>
                <Stack
                    spacing={2}
                    direction="row"
                >
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
                            // setCurrentChat(key);
                            window.location.href = '/friends/chat';
                        }}
                    >
                        
                        <ChatIcon id="action-icon-chat" fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        edge="start"
                        color="primary"
                        title="Sort FriendList"
                        aria-expanded={openSortMenu ? 'true' : undefined}
                        onClick={handleOpenSortMenu}
                    >
                        <SortIcon style={{ transform: "rotate(180deg)" }}/>
                    </IconButton>
                </Stack>
            </div>
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
    
            {details
            // slice the array from the range from page * Total limit  
            .slice((page - 1) * ItemLimit, page * ItemLimit)
            .map((key, index)=>{
                return(
                    <div className="friends-card" key={index} onClick={()=>{window.location.href=`users/${key.Username}`}} >
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
                                {/* <div className="friends-chat">
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
                                            // setCurrentChat(key);
                                            window.location.href = '/friends/chat';
                                        }}
                                    >
                                        
                                        <ChatIcon id="action-icon-chat" />
                                    </IconButton>
                                </div> */}
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
            <div className="friendlist-paginate" style={{bottom : "0" , width:"95%", whiteSpace:"nowrap", display: VisiblePaginate() ? 'flex' : 'none' }}>
                <Divider />
                <div className="friendlist-paginate-wrapper" style={{display : "flex" , justifyContent:"center"}}>
                    <Pagination 
                        variant="outlined" 
                        page={page}
                        // Set the Maximum Number of Page 
                        // Ceil - to round the number into the high nearest integer
                        count={Math.ceil(details.length / ItemLimit)}
                        onChange={changePage}
                        defaultPage={1}
                        size='medium'
                        showFirstButton
                        showLastButton
                    />
                </div>
            </div>
            {/* Menu For Sorting FriendList */}
            <Menu
                id="basic-menu"
                anchorEl={anchorElSort}
                open={openSortMenu}
                onClose={handleCloseSortMenu}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={()=>{
                    details.sort(sortFriendAsc("Name"))
                    handleCloseSortMenu()
                }}>A - Z Ascending</MenuItem>
                <MenuItem onClick={()=>{
                    details.sort(sortFriendDesc("Name"))
                    handleCloseSortMenu()
                }}>Z - A Descending</MenuItem>
            </Menu>

            {/* Dialog for Blacklist */}
            <ActionDialog open={openBlacklistDialog} handleClose={handleCloseBlacklist} message={`Do you want to Blacklist ${name}`} action={()=>blacklist(ID)} />
            {/* Dialog for Remove */}
            <ActionDialog open={openDeleteDialog} handleClose={handleClose} message={`Are you sure want to remove ${name} from your friend list`} action={deletefriend} />
        </>
     );
}
 
export default FriendsList;