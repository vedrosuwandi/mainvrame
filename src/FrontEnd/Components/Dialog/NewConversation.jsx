import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewConversation = ({id, conversations ,friends, open, handleClose, setConversation, setCurrentChat, socket}) => {
    const [friendList , setFriendList] = React.useState([]);

    React.useEffect(()=>{
        friends.forEach((key, index)=>{
            if(!key.Blacklist){
                axios.get(`${localStorage.getItem('url')}/user/getfriend/${key._id}`)
                .then((response)=>{
                    // console.log(response.data.response);
                    setFriendList(prevState => [ ...prevState , response.data.response])
                }).catch((err)=>{
                   console.log(err.response)
                })
            }
        })
    },[friends])



    // console.log(conversations)
  
    const addConversation = async (ID) =>{
        if(!conversations.some(conversation => conversation.Members.some(member => member === ID))){
            await axios.post(`${localStorage.getItem('url')}/conv/add`, {
                SenderID : id,
                ReceiverID : ID
            }).then((response)=>{
                setConversation(prevState => [ ...prevState , response.data])
                socket?.emit("sendData",{ data : response.data , UserID : ID });
                setCurrentChat(response.data);
                setTimeout(()=>{
                    handleClose()
                }, 100)
            }).catch((err)=>{
                console.log(err);
            })
        }else{
            setCurrentChat(conversations.filter(conversation => conversation.Members.some(member => member === ID))[0])
            setTimeout(()=>{
                handleClose()
            }, 100)
        }
    }
    

    return ( 
        <>
           <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', backgroundColor : 'black' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            New Conversation
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List>
                    {
                        friendList.map((key, index)=>{
                            return(
                                <>  
                                    <ListItem button onClick={()=>{addConversation(key._id)}}>
                                        <ListItemAvatar>
                                            <Avatar>
                                            <img src={`${localStorage.getItem('url')}/user/getavatar/${key._id}`} alt="avatar" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={key.Name} 
                                        />
                                    </ListItem>
                                    <Divider />
                                </>
                            )
                        })
                    }
                </List>
            </Dialog>
        </>
     );
}
 
export default NewConversation;