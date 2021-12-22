import { useState , useEffect} from 'react';
import axios from 'axios';


import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';

// import Avatar from '../../Assets/avatar.png';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';

import './FriendList.css';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '50ch',
      },
    },
  }));
  

const FriendList = ({user}) => {

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };
   


    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={0} color="error">
              <PersonAddIcon />
            </Badge>
          </IconButton>
          <p>Show Request</p>
        </MenuItem>
      </Menu>
    );
  

    const [friendDetails, setFriendDetails] = useState([]);
    const [details , setDetails] = useState([]);
    
    const getfriendlist = async ()=>{
      // Append the data from id inside user.Friends to friendDetails as array of objects
      await user.Friends.forEach((key, i)=>{
          axios.get(`${localStorage.getItem('localhost')}/user/getfriend/${key._id}`)
          .then((response)=>{
              setFriendDetails(prevState => [...prevState , response.data.response])
          }).catch((err)=>{
              console.log(err)
          })
      })
    }

    const checkOnline = async () =>{  
        const request =  friendDetails.forEach((key, index)=>{
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
      

    useEffect( () => {
      getfriendlist()
      // eslint-disable-next-line
    },[user.Friends])
    
    useEffect(()=>{
      // Calls when the friend details is 
      if(friendDetails.length === user.Friends.length){
        checkOnline()
      }
      // eslint-disable-next-line
    },[friendDetails])
  
  

    return ( 
        <div className="friendlist-container"> 
            <div className="friendlist-search">
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" style={{ background: '#000000' }}>
                        <Toolbar>
                            <Search>
                                <SearchIconWrapper>
                                <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        <Box sx={{ flexGrow: 1 }} />
                     
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                            >
                            <MoreIcon />
                            </IconButton>
                        </Box>
                        </Toolbar>
                    </AppBar>
                    {renderMobileMenu}
                </Box>
            </div>
            <div className="friendlist-wrapper-container">
                <div className="friendlist-wrapper">
                      {details.map((key, index)=>{   
                        return(
                          <div className="friendlist-item" key={index}>
                                  <div className="friendlist-avatar">
                                      <div className="friendlist-avatar-container" 
                                        style={{
                                          borderColor : key.Online === "hidden" ?
                                          "grey" : 
                                          key.Online ?
                                          "green"
                                          :
                                          "red"
                                          }}>
                                          <img src={`${localStorage.getItem('localhost')}/user/getavatar/${key._id}`} alt="avatar" />
                                      </div>
                                  </div>
                                  <div className="friendlist-name">
                                    {key.Name}
                                  </div>
                              </div>
                          )
                      })}
                </div>
              
            </div>
        </div>
     );
}
 
export default FriendList;