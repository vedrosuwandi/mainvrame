import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const SidebarItem = ({icon, target, text}) => {
    return ( 
        <ListItem button component="a" href={target}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
     );
}
 
export default SidebarItem;