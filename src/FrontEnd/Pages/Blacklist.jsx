import React , {useState} from 'react'

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';

import BlackList from '../Components/Blacklists/BlackList';
import Navbar from '../Components/Header/Navbar';
import Blacklisted from '../Components/Blacklists/BlackListed';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
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
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

const Blacklist = ({user, logout, refresh}) => {
    const [friendListValue, setFriendListValue] = useState(0);

    const handlefriendListChange = (event, newValue) => {
      setFriendListValue(newValue);
    };

    if(!user.Contact){
        return null;
    }    
    return (
        <div className='blacklist-container'>
            <div className="blacklist-nav">
                <Navbar user={user} logout={logout} showSearchbar={true}/>
            </div>
            <div className="blacklist-content">
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={friendListValue} onChange={handlefriendListChange} variant="fullWidth" aria-label="full width tabs example">
                            <Tab label="Blacklist" {...a11yProps(0)} />
                            <Tab label="Blacklisted" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={friendListValue} index={0}>
                        <BlackList user={user} refresh={refresh} />
                    </TabPanel>
                    <TabPanel value={friendListValue} index={1}>
                        <Blacklisted user={user} refresh={refresh} />
                    </TabPanel>
                </Box>
            </div>
        </div>
    )
}

export default Blacklist
