import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';

import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import BookIcon from '@mui/icons-material/Book';

import SidebarItem from './SidebarItem';

const SidebarMenu = ({toggleDrawer, user}) => {

    return (   
      <Box
        sx={{ width: 250}}
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
      >
        <List>
            <SidebarItem icon={<HomeIcon />} text="Home" target="/dashboard" />
            <SidebarItem icon={<SchoolIcon />} text="Mainvrame Academy" target="https://mainvrame.city/academy" />
        </List>
        <Divider />
        <List>
            <SidebarItem icon={<PeopleIcon />} text="Friends" target="/friends" />
            <SidebarItem icon={<NotInterestedOutlinedIcon />} text="Blacklist" target="/blacklist" />
            <SidebarItem icon={<PersonIcon />} text="Profile" target="/profile" />
            <SidebarItem icon={<BookIcon />} text="Blogs" target={`/users/${user.Username}`} />
            <SidebarItem icon={<InfoIcon />} text="About" target="http://omnivr.co" />
        </List>
      </Box> 
    );
}
 
export default SidebarMenu;
