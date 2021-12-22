import React , {useState, useEffect} from 'react';
import axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';

import SideBarMenu from './Sidebar/SidebarMenu'

import './Navbar.css';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(0),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
    width: 'auto',
  },
  [theme.breakpoints.down('md')]: {
    borderRadius : 0
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
  [theme.breakpoints.down('md')]: {
    display : 'none'
  },
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
      width: '70ch',
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: `calc(1em + ${theme.spacing(0)})`
    },
  },
}));

const StyledSearchButton = styled(Button)(({ theme }) => ({
    borderRadius : 0,
    backgroundColor : 'rgb(247, 141, 30)'
}));

const Navbar = ({user, logout, showSearchbar}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  
    const isMenuOpen = Boolean(anchorEl);
    
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };

    const [hidden, setHidden] = useState();
    const hiddenChange = (event) => {
      axios.post(`${localStorage.getItem('localhost')}/online/sethidden/${user.Username}`,
      {
        State : event.target.checked
      }).catch((err)=>{
        console.log(err.message)
      })
    
      setHidden(event.target.checked);     
    };

    useEffect(()=>{
        axios.get(`${localStorage.getItem('localhost')}/online/checkhidden/${user.Username}`)
        .then((response)=>{
          setHidden(response.data.Hidden);
        }).catch((err)=>{
          console.log(err.message)
        })
    },[user])
  
    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem href="/profile" component="a" sx={{justifyContent:"center"}} > Profile </MenuItem>
        <MenuItem>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={hidden}
                  onChange={hiddenChange}
                  aria-label="hidden switch"
                />
              }
              label={hidden ? 'Hidden' : 'Visible'}
              labelPlacement="start"
            />
          </FormGroup>
        </MenuItem>
        <MenuItem onClick={logout} sx={{justifyContent:"center"}} >LogOut</MenuItem>
      </Menu>
    );

    // Mobile 
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
            <MenuItem href="/profile" component="a" sx={{justifyContent:"center"}} >{user.Name}</MenuItem>
            <MenuItem>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hidden}
                      onChange={hiddenChange}
                      aria-label="login switch"
                    />
                  }
                  label={hidden ? 'Hidden' : 'Visible'}
                  labelPlacement="start"
                />
              </FormGroup>
            </MenuItem>
            <MenuItem onClick={logout} sx={{justifyContent:"center"}} >LogOut</MenuItem>
        </Menu>
 
    );
  
    //SideBar
    const [openSidebar, setSidebar] = useState(false);

    const toggleDrawer = (anchor, open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setSidebar({ ...openSidebar, [anchor]: open });
    };

    const [searchValue , setSearchValue] = useState("");
    const handleSearchValue = (event) =>{
      setSearchValue(event.target.value);
    }

    const search = (value)=>{
      window.location.href = `/users/${value}`;
    }

    return ( 
        <div className="nav-container">  
         <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: '#000000' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer('left', true)}
                    >
                      <MenuIcon />
                    </IconButton>
                    
                    {/* Sidebar */}
                    <SwipeableDrawer
                      anchor='left'
                      open={openSidebar['left']}
                      onClose={toggleDrawer('left', false)}
                    >
                      <SideBarMenu toggleDrawer={toggleDrawer('left', openSidebar)} />
                    </SwipeableDrawer>

                    
                    {/* <form onSubmit={()=>search(searchValue)} style={{display:'flex'}}>      */}
                      <Search style={{display: showSearchbar ? 'block' : 'none' }} >
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          value={ searchValue }
                          onChange={handleSearchValue}
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>

                      <StyledSearchButton onClick={()=>search(searchValue)} variant="contained" style={{display: showSearchbar ? 'block' : 'none' }}> 
                        <SearchIcon /> 
                      </StyledSearchButton>
                    {/* </form> */}

                    <Box sx={{ flexGrow: 1 }} />

                      {/* Menu on the Right Side */}          

                      {/* Chat */}
                      <Box sx={{ display: { xs: 'none', md: 'flex' } }}> 
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="home-nav"
                            color="inherit"
                        >
                            <Badge badgeContent={0} color="error">
                              <ChatIcon />
                            </Badge>               
                        </IconButton>
                      </Box>

                      {/* Home */}
                      <Box sx={{ display: { xs: 'none', md: 'flex' } }}> 
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="home-nav"
                            color="inherit"
                            href="/friends"
                        >
                            <Badge badgeContent={0} color="error">
                              <PeopleIcon />
                            </Badge>               
                        </IconButton>
                      </Box>


                      {/* Account Profile */}
                      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Typography>
                                {user.Name} &nbsp;
                            </Typography>
                              <Avatar src={`${localStorage.getItem('localhost')}/user/getavatar/${user._id}`} alt="avatar" />
                        </IconButton>
                    </Box>
                     
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                        >
                            <Avatar src={`${localStorage.getItem('localhost')}/user/getavatar/${user._id}`} alt="avatar" />
                        </IconButton>
                    </Box>
                    
                </Toolbar>
              </AppBar>
              {renderMobileMenu}
              {renderMenu}
            </Box>
        </div>
     );
}
 
export default Navbar;