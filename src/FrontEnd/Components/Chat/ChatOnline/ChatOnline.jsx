import {useEffect , useState} from 'react';
import './ChatOnline.css';

import Badge from '@mui/material/Badge';
import { makeStyles } from "@material-ui/core/styles";

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    badge: {
      backgroundColor : 'limegreen'
    }
  }));

const ChatOnline = ({onlineusers, user, setCurrentChat}) => {
    const classes = useStyles()

    // friendList 
    const [friends, setFriends] = useState([]);

    const [onlineFriends , setOnlineFriends] = useState([]);

    useEffect(() => {
      // get friend data
      user.Friends.forEach((key, index)=>{
        if(!key.Blacklist){
            axios.get(`${localStorage.getItem('url')}/user/getfriend/${key._id}`)
            .then((response)=>{
                setFriends(prevState => [ ...prevState , response.data.response])
            }).catch((err)=>{
              console.log(err.response);
            })
        }
    })
    }, [user])


    // filter friends based on the friend id on the online users
    useEffect(()=>{
      setOnlineFriends(friends.filter( friend => onlineusers.some(onlineuser => onlineuser._id === friend._id) ))
    },[friends, onlineusers])    


    // find the conversation between the user and friend that online
    const findConversation = (friend) =>{
      axios.get(`${localStorage.getItem('url')}/conv/findconv/${user._id}/${friend._id}`)
      .then((response)=>{
        // console.log(response.data);
        setCurrentChat(response.data)
      }).catch((err)=>{
        console.log(err)
      })
    }


    return ( 
       <div className="ChatOnline-container">
         {
           onlineFriends.map((key, index)=>{
             return(
                <div className="chatOnline-friend" onClick={()=>{findConversation(key)}}>
                      <div className="chatOnline-avatar-container">
                        <Badge 
                            badgeContent="" 
                            classes={{badge : classes.badge}}
                            variant='dot'
                        > 
                          <img 
                              className='chatOnline-avatar'
                              src={`${localStorage.getItem('url')}/user/getavatar/${key._id}`}
                              alt="avatar"
                          />
                        </Badge>
                      </div>
                      <span className="ChatOnline-name">
                          {key.Name}
                      </span>
                </div>
             )
           })
         }
       </div>
     );
}
 
export default ChatOnline;