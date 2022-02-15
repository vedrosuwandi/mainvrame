import {useState, useEffect} from 'react';
import axios from 'axios';

import IconButton from '@mui/material/IconButton';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import './Conversation.css'

const ConversationMore = ({id, name}) =>{
    /*More Menu Button*/
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const openConversationMenu = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
 
    const closeConversationMenu = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return(
        <>
            <IconButton
                onClick={openConversationMenu}
            > 
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeConversationMenu}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={closeConversationMenu}>Delete</MenuItem>
            </Menu>
        </>
    );
 
}


const Conversation = ({user, conversation, selected}) => {
    const [friend, setFriend] = useState(null)


    useEffect(()=>{
        // find the Id of the members in the conversation that is not the userID
        const friendID = conversation.Members.find((member) => member !== user._id); 
        // get friend data
        axios.get(`${localStorage.getItem('url')}/user/getfriend/${friendID}`)
        .then((response)=>{
            setFriend(response.data.response)
        }).catch((err)=>{
            console.log(err.response)
        })

        
    },[conversation , user])

    if(!friend){
        return null
    }

    return ( 
       <div className={selected ? 'conversation-container selected' : 'conversation-container' }>
           
            <img src={`${localStorage.getItem('url')}/user/getavatar/${friend._id}`} alt="avatar" className='conversation-avatar'/>
         
            <span className="conversation-name">
                {friend.Name}
            </span>

            <div className='conversation-more'>
                <ConversationMore id={friend._id} name={friend.Name} />
            </div>

         
       </div>
     );
}
 
export default Conversation;