import React, {useState, useEffect} from 'react';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';

import PeopleIcon from '@mui/icons-material/People';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PendingIcon from '@mui/icons-material/Pending';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';

import FriendRequest from '../Components/Friends/FriendRequest';
import Navbar from '../Components/Header/Navbar';
import '../Style/Friends.css';
import FriendsList from '../Components/Friends/FriendsList';
import FriendSent from '../Components/Friends/FriendSent';
import BlackList from '../Components/Friends/BlackList';



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}



const Friends = ({user, countRequest ,logout}) => {
    const [value, setValue] = useState(0);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const [friendListValue, setFriendListValue] = useState(0);

    const handlefriendListChange = (event, newValue) => {
      setFriendListValue(newValue);
    };

    useEffect(()=>{
        if(Object.keys(user).length === 0){
            return null
        }
    },[user])




    if(!user.Contact){
        return null;
    }     


    return (
        <div className="friends-container">
            <div className="friends-wrapper">
                <div className="friends-nav">
                    <Navbar user={user} logout={logout} showSearchbar={true} />
                </div>
                <div className="friends-content">
                    <div className="friends-tab">
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="full width tabs example">
                                    <Tab icon={<PeopleIcon />} label="Friend List" {...a11yProps(0)} sx={{ flex:1 }} />

                                    <Tab icon={ 
                                        <Badge color="error" badgeContent={countRequest}>
                                            <PeopleAltIcon />
                                        </Badge>
                                    } label="Friend Request" {...a11yProps(1)} sx={{ flex:1 }} />

                                    <Tab icon={<PendingIcon />} label="Request Sent" {...a11yProps(2)} sx={{ flex:1 }} />
                                </Tabs>
                            </Box>
                            
                            <TabPanel value={value} index={0}>
                                {/* <FriendsList user={user} /> */}
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={friendListValue} onChange={handlefriendListChange} variant="fullWidth" aria-label="full width tabs example">
                                            <Tab icon={<PeopleIcon />} label="Friend List" {...a11yProps(0)} />
                                            <Tab icon={<NotInterestedOutlinedIcon />} label="Blacklists" {...a11yProps(1)} />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={friendListValue} index={0}>
                                        <div className="friend-container" >
                                            <FriendsList user={user} />
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={friendListValue} index={1}>
                                        <BlackList user={user} />
                                    </TabPanel>
                                </Box>
                            </TabPanel>

                            <TabPanel value={value} index={1}>
                                <FriendRequest user={user} />
                            </TabPanel>

                            <TabPanel value={value} index={2}>
                                <FriendSent user={user} />
                            </TabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friends;

