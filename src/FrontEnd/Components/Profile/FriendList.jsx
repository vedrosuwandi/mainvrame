import { useState , useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';

import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

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



const FriendList = ({user, refresh}) => {


  /*Mobile Menu*/
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
        <MenuItem
          onClick={()=>{
            window.location.href= "/friends";
          }}
        >
          <IconButton
            size="large"
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
  
    /*Sort Menu*/
    const [anchorElSort, setAnchorElSort] = useState(null);
    const openSortMenu = Boolean(anchorElSort);
    const handleOpenSortMenu = (event) => {
      setAnchorElSort(event.currentTarget);
    };
    const handleCloseSortMenu = () => {
      setAnchorElSort(null);
    };


    /*Sort Details Array*/
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

    const [friendDetails, setFriendDetails] = useState([]);
    const [details , setDetails] = useState([]);
    
    const getfriendlist = async ()=>{
      // Append the data from id inside user.Friends to friendDetails as array of objects
      await user.Friends.forEach((key, i)=>{
        if(!key.Blacklist){
          axios.get(`${localStorage.getItem('localhost')}/user/getfriend/${key._id}`)
          .then((response)=>{
              setFriendDetails(prevState => [...prevState , response.data.response])
          }).catch((err)=>{
              console.log(err)
          })
        }
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

     
     /*Paginate*/
    // How many Items in one page
    const ItemLimit = 4;
    //Current Page
    const [page, setPage] = useState(1);
    // Set the Maximum Number of Page 

    const changePage = (event, value)=>{
      setPage(value);
    }

    /*UseEffect */
    useEffect( () => {
      getfriendlist()
      // eslint-disable-next-line
    },[user.Friends])
    
    useEffect(()=>{
      axios.get(`${localStorage.getItem('localhost')}/user/countblacklistfriend`,{
        headers :{
            Authorization : "Bearer " + Cookies.get('token')
        }
    }).then((response)=>{
      // Calls when the friend details is 
        if(friendDetails.length === user.Friends.length - response.data.count){
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
                        <IconButton
                          size="small"
                          edge="start"
                          color="primary"
                          title="Sort FriendList"
                          aria-expanded={openSortMenu ? 'true' : undefined}
                          onClick={handleOpenSortMenu}
                        >
                            <SortIcon style={{ transform: "rotate(180deg)", color:"white" }}/>
                        </IconButton>
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
                      {details
                      // slice the array from the range from page * Total limit  
                      .slice((page - 1) * ItemLimit , page * ItemLimit)
                      .map((key, index)=>{   
                        return(
                          <div className="friendlist-item" key={index} onClick={()=>window.location.href=`/users/${key.Username}`}>
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
              <Divider />
              <div className="friendlist-paginate">
                <Pagination 
                  variant="outlined" 
                  page={page}
                  // Ceil - to round the number into the high nearest integer
                  count={Math.ceil(friendDetails.length / ItemLimit)}
                  onChange={changePage}
                  defaultPage={1}
                  size='medium'
                />
              </div>
        </div>
     );
}
 
export default FriendList;