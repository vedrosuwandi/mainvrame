import React , {useState} from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';


import './Navbar.css';


const Navbar = ({user, logout}) => {

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
        <MenuItem href="/profile" component="a" > Profile </MenuItem>
        <MenuItem onClick={logout}>LogOut</MenuItem>
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
            <MenuItem href="/profile" component="a" >{user.Name}</MenuItem>
            <MenuItem onClick={logout}>LogOut</MenuItem>
        </Menu>
 
    );
  

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
                    >
                        <MenuIcon />
                    </IconButton>
                
                    <Box sx={{ flexGrow: 1 }} />

                      {/* Menu on the Right Side */}

                      {/* Home */}
                      <Box sx={{ display: { xs: 'none', md: 'flex' } }}> 
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="home-nav"
                            color="inherit"
                        >
                            <Typography style={{color:"white", textDecoration:"none"}} component="a" href="/dashboard">
                                Home
                            </Typography>                         
                        </IconButton>
                      </Box>

                      {/* About */}
                      <Box sx={{ display: { xs: 'none', md: 'flex' } }}> 
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="about-nav"
                            color="inherit"
                        >
                            <Typography style={{color:"white", textDecoration:"none"}} component="a" href="/dashboard">
                                About
                            </Typography>                         
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
                            <AccountCircle />
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
                            <AccountCircle />
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