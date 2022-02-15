import * as React from 'react';
import { format } from 'timeago.js';
import axios from 'axios';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import './Message.css'




const Message = ({message , owner, socket, setMessage, setMessagePartial ,currentChat}) => {
    
    const unsend = (id, convID) =>{
        axios.delete(`${localStorage.getItem('url')}/chat/unsend/${convID}`, {
            data : {
                ID : id
            }
        }).then((response)=>{
            socket?.emit("UnsentMessage", {
                Message : message ,
                ReceiverID : currentChat?.Members.find(member => member !== message.Sender),
            })
            
            setMessage(prevState => prevState.filter(messages => messages !== message));
            setMessagePartial(prevState => prevState.filter(messages => messages !== message));
        }).catch((err)=>{
            console.log(err);
        })
    }

    const MessageAction = ({id, convID, text}) =>{

        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        return(
            <>
                <div className="message-action" onClick={handleClick}>
                    <ArrowDropDownIcon />
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    >
                    {/* <MenuItem onClick={()=>{
                        console.log(text)
                    }}>Edit Chat</MenuItem> */}
                    <MenuItem onClick={() =>{
                        unsend(id, convID)
                    }}>Delete Chat</MenuItem>
                </Menu>
            </>
        )
    }

    return ( 
        <div className={owner ? 'message-container owner' : 'message-container'}>
            <div className="message-content">
                <img src={`${localStorage.getItem('url')}/user/getavatar/${message.Sender}`} alt="avatar" className='message-user' style={{display : owner ? 'none' : '' }} />
                <p className='message-text' >
                    {message.Text}
                    <span>
                        <MessageAction id={message._id} convID={message.ConversationID} text={message.Text} socket={socket} />
                    </span>
                </p>
            </div>
            <div className="message-footer">
                {format(message.createdAt)}
            </div>
        </div>
     );
}
 
export default Message;