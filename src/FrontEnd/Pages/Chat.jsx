import React , {useState, useEffect, useRef} from 'react'
import axios from 'axios';
import { io } from 'socket.io-client';

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import { Form } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

import Navbar from '../Components/Header/Navbar'
import Conversation from '../Components/Chat/Conversation/Conversation';
import Message from '../Components/Chat/Message/Message';
import ChatOnline from '../Components/Chat/ChatOnline/ChatOnline';

import '../Style/Chat.css';
import NewConversation from '../Components/Dialog/NewConversation';


const Chat = ({user,logout, refresh}) => {

    //Open New Conversation Dialog
    const[openNewConv , setOpenNewConv] = useState(false);

    const OpenNewConversation = () =>{
        setOpenNewConv(true)
    }

    const CloseNewConversation = () =>{
        setOpenNewConv(false)
    }

    // friends that user have a conversation with    
    const [conversations , setConversations] = useState();

    // eslint-disable-next-line 
    // new Conversation
    const [newConversation , setNewConversation] = useState(null);
    
    // selected conversation
    const [currentChat, setCurrentChat] = useState(null);

    // current message with the selected user (conversation)
    // All Message in one conversation
    const [message, setMessage] = useState(null);
    // Message (partial)
    const [messagePartial , setMessagePartial] = useState(null);
    // chat limit
    const [limit, setLimit] = useState(10);
    // scroll position
    const [scrollPosition , setScrollPosition] = useState(null);
    // show scroll down button
    const [scrollDownButtonActive , setScrollDownButtonActive ] = useState(false);

    //incoming Message
    const [incomingMessage , setIncomingMessage ] = useState(null)

    //Emoji
    const PanelRef = useRef(null);
    const [showEmojiPanel , setShowEmojiPanel] = useState(false);

    const handleShowEmojiPanel = () =>{
        setShowEmojiPanel(!showEmojiPanel);
    }
    const handleSelectEmoji = (event) =>{
        setNewMessage((newMessage) => (newMessage += event.native))
    }

    const handleOutsideClick = (event) =>{
        if(PanelRef.current && !PanelRef.current.contains(event.target)){
            setShowEmojiPanel(false)
        }
    }

    useEffect(()=>{
        document.addEventListener('click' , handleOutsideClick, true);
        return () =>{
            document.removeEventListener('click' , handleOutsideClick, true)
        }
    },[PanelRef])

    //deleted Message
    const [deletedMessage , setDeletedMessage] = useState(null);

    // input value
    const [newMessage , setNewMessage] = useState("");

    //online users
    const [onlineUsers , setOnlineUsers] = useState([])


    const changeNewMessage = (event) =>{
        setNewMessage(event.target.value);
    }

    /* Search Conversation */
    const [searchconv, setSearchConv] = useState(null);
    const [searchID , setSearchID] = useState([]);

    const searchChanges = (event) =>{
        setSearchConv(event.target.value);
        if(event.target.value !== null || event.target.value !== ""){
            axios.get(`${localStorage.getItem('url')}/user/getID/${event.target.value}`)
            .then((response)=>{
                // setSearchID( response.data._id);
                setSearchID(response.data.map(key => key._id))
            })
        }
    }

   

    // Send Message
    const sendMessage = (event) =>{
        event.preventDefault();
        if(newMessage !== ""){
            axios.post(`${localStorage.getItem('url')}/chat/send` , {
                ConversationID : currentChat._id,
                Sender : user._id,
                Text : newMessage,
            }).then((response)=>{
                // send the data to the socket server
                socket?.current.emit("SendMessage" , {
                    _id : response.data._id,
                    userID : user._id,
                    receiverID : currentChat.Members.find(member => member !== user._id ),
                    text : newMessage
                })
                setMessage([...message , response.data]) 
                setMessagePartial([...messagePartial, response.data])
                scrolltoBottom()
                // Clear text input
                setNewMessage("")
            }).catch((err)=>{
                console.log(err);
            })        
            
        }
    }

    
    // get the friend that the user is chat with (Conversation)
    useEffect( ()=>{
        // find the conversation with the member id of the user
        axios.get(`${localStorage.getItem('url')}/conv/${user._id}`)
        .then((response)=>{
            // set conversation array
            setConversations(response.data)
            // console.log(response.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[user._id, refresh])


    // Connecting to Socket Server
    const socket = useRef();

    useEffect(()=>{
        // connecting to the socket server
        socket.current = io(localStorage.getItem('socketURL'))
        
        socket.current.on("getMessage" , data =>{
            setIncomingMessage({
                _id : data._id,
                Sender : data.userID,
                Text : data.text,
                CreatedAt : Date.now()
            })
        })

        socket.current.on("getNewConversation" , data =>{
            setNewConversation(data)
        })

        socket.current.on("currentMessage" , data =>{
            setDeletedMessage(data);
        })
    },[socket])


    // useEffect(()=>{
    //     newConversation &&  setConversations(prevState => [...prevState, newConversation])  
    // }, [ newConversation])


    useEffect(()=>{
        // set the connection into websocket Server
        socket?.current.emit("SendUser" , user._id);

        // retrieve data from server
        socket?.current.on("getUsers" , users =>{
            // to retrieve the user that is online and append it on the OnlineUser array
            // filter the friends id in the user.Friends with the data on the id on the socket
            if(user.Friends){
                setOnlineUsers(Object.values(user?.Friends)?.filter((friend) => users.some( (user) => user.userID === friend._id )));
            }
        })
    },[user, socket])


    // selected conversation
    useEffect( ()=>{
        const getChat = async () =>{   
            await axios.get(`${localStorage.getItem('url')}/chat/${currentChat?._id}`)
            .then((response)=>{
                // render the message from the selected conversation
                setMessage(response.data);
                // slice the data into the last (10) of the message
                setMessagePartial(response.data.slice(-limit));
            }).catch((err)=>{
                console.log(err)
            })
        }
    
        getChat()
    },[currentChat, limit])

    // function when the user scroll up
    const inverseScroll = (event) =>{
        // event.preventDefault();
        // // set the scroll position
        // setScrollPosition(event.target.scrollTop);
        // // if the scroll position is on the top and the load message is not finished yet.
        // if(event.target.scrollTop <= 0 && messagePartial.length !== message.length){
        //     // set the chat limit for the partial message
        //     setLimit(prevState => prevState + 10)
        //     // change the partial message into the next limit
        //     setMessagePartial(message.slice(-limit));
        //     // lower the scroll slightly when the new data is loaded
        //     if(messagePartial.length >= message.length){
        //         document.getElementById('chat-box').scrollTop = scrollPosition;
        //     }else{
        //         document.getElementById('chat-box').scrollTop = scrollPosition + 100;
        //     }
        // }

        // show the "Back to latest button"
        if(event.target.scrollHeight - event.target.scrollTop <= event.target.clientHeight + 500){
            setScrollDownButtonActive(false);
        }else{
            setScrollDownButtonActive(true);
        }
    }

    // scroll to bottom function
    const scrolltoBottom = () =>{
        scrollRef.current?.scrollIntoView({
            behavior : "smooth"
        }) 
    }

    const scrollRef = useRef();
    // automatically scroll down the chat box
    useEffect(()=>{
        if(limit <= 10){
            scrolltoBottom()
        }
    },[messagePartial, limit])


    useEffect(()=>{
        
        deletedMessage && currentChat?.Members.includes(deletedMessage.Sender) && setMessagePartial(prevState => prevState?.filter(messages => messages._id !== deletedMessage._id)) && setMessage(prevState => prevState?.filter(messages => messages._id !== deletedMessage._id)) 
        // eslint-disable-next-line
    },[deletedMessage, currentChat])
    
    // update the messages after the message is sent
    useEffect(()=>{
        if(message !== null && messagePartial !== null){
            incomingMessage && currentChat?.Members.includes(incomingMessage.Sender) && setMessagePartial(prevState => [ ...prevState, incomingMessage]) && setMessage( prevState => [...prevState , incomingMessage])
        }
        // eslint-disable-next-line
    },[incomingMessage, currentChat])

    if(!user.Contact){
        return null
    }

    const alert = () =>{
        if( user.Blacklist.some(member => member._id === currentChat?.Members.find(member => member !== user._id)) ){
            return(
                <>
                    <Alert severity="error" sx={{width : '100%' , justifyContent : "center"}} > This User is in Your Blacklist </Alert>
                </>
            )
        }else if( user.Blacklisted.some(member => member._id === currentChat?.Members.find(member => member !== user._id))){
            return(
                <>
                    <Alert severity="error" sx={{width : '100%' , justifyContent : "center"}} > You have been blacklisted by this user </Alert>
                </>
            )
        }else{
            return(
                <>
                </>
            )
        }
    }


    return (
        <div className='chat-container'>
            <div className="chat-header" style={{position : 'sticky', zIndex : '5', width : '100%', top:'0'}}>
                <div className="chat-navbar">
                    <Navbar user={user} logout={logout} showSearchbar={true} />
                </div>
            </div>
            <div className="chat-contents">
                <div className="chat-menu">
                    <div className="chat-menu-wrapper">
                        <Stack direction='row' > 
                            <input 
                                placeholder="Search for friends" 
                                className='chat-menu-input' 
                                value={searchconv} 
                                onChange={searchChanges} 
                            />
            
                            <IconButton
                                size="small"
                                onClick={OpenNewConversation}
                                sx = {{
                                    padding: '0px 10px',
                                    backgroundColor : "grey",
                                }}
                            >
                                <AddIcon fontSize="small"  />
                            </IconButton>
                        </Stack>
                       
                        {
                            searchconv === null || searchconv === "" ? 
                            conversations.map((key, index)=> 
                                (
                                    <div onClick={()=> {
                                        setCurrentChat(key);
                                    }}>
                                        <Conversation 
                                            conversation={key} 
                                            user={user} 
                                            selected={ currentChat === key }
                                        />
                                    { /* {console.log(key.Members.filter(member => member !== user._id))} */}
                                    </div>
                                )
                            )
                            :
                            conversations
                            .filter(
                                conversation => conversation?.Members.find(
                                    member => searchID.includes(member) && member !== user._id
                                    )
                                )
                            .map((key, index)=> 
                            (
                                <div onClick={()=> {
                                    setCurrentChat(key);
                                }}>
                                    <Conversation 
                                        conversation={key} 
                                        user={user} 
                                        selected={ currentChat === key }
                                    />
                                { /* {console.log(key.Members.filter(member => member !== user._id))} */}
                                </div>
                            )
                    
                        )
                        }
                    </div>
                </div>
                <div className="chat-box">
                    <div className="chat-box-wrapper">
                        <div className="chat-box-alert">
                            {
                                alert()
                            }
                        </div>
                        {
                            currentChat ? 
                                <>

                                    <div className="chat-box-top" id='chat-box' 
                                    onScroll={inverseScroll}
                                    >
                                    
                                        {
                                            // 1 week = 604800000 milliseconds
                                            // .filter(messageList => Date.now() -  Date.parse(messageList.createdAt) < 604800000)
                                            message?.map((key)=>
                                                (
                                                    <div ref={scrollRef}>
                                                        <Message 
                                                            currentChat={currentChat}
                                                            setMessage={setMessage}
                                                            setMessagePartial={setMessagePartial}
                                                            socket={socket.current}
                                                            message={key} 
                                                            owner= {
                                                                key.Sender === user._id
                                                            }
                                                        />
                                                    
                                                    </div>
                                                )
                                            )
                                        }
                                        <div className='chat-box-scroll'>
                                            { scrollDownButtonActive ? 
                                                <Button 
                                                    variant="contained" 
                                                    onClick={scrolltoBottom} 
                                                    size="small"
                                                    startIcon={<ArrowDownwardIcon />}
                                                >
                                                    Back to Latest
                                                </Button>
                                            :
                                                <div>
                                                    &nbsp;
                                                </div>
                                            }
                                        </div> 
                                    </div>
                                        <div className='chat-emoji-panel' ref={PanelRef}>
                                            {
                                                showEmojiPanel && (
                                                    <div>
                                                        <Picker
                                                            onSelect={ handleSelectEmoji }
                                                            emojiSize={20}
                                                            title={
                                                                <p 
                                                                style={{
                                                                    fontSize:"15px",
                                                                    color : 'black'
                                                                }}
                                                                > 
                                                                    Choose Emoji
                                                                </p>
                                                            }
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                   
                                    <div className="chat-box-bottom">
                                        <Form onSubmit={sendMessage}
                                            style={{
                                                width : '100%',
                                                display : 
                                                    user.Blacklist.some(member => member._id === currentChat?.Members.find(member => member !== user._id)) 
                                                    || 
                                                    user.Blacklisted.some(member => member._id === currentChat?.Members.find(member => member !== user._id)) 
                                                    ?
                                                    'none'
                                                    :
                                                    'flex',
                                                alignItems : "center",
                                                justifyContent : 'space-between'
                                            }}
                                        >
                                            <TextField 
                                                id="outlined-basic" 
                                                size="small"
                                                className="chat-box-input" 
                                                placeholder="Enter Text" 
                                                variant="outlined" 
                                                onChange={changeNewMessage}
                                                value={newMessage}
                                                style={{marginTop:'5px'}}
                                            />
                                            <IconButton
                                                className='chat-emoji-button'
                                                type='button'
                                                onClick={handleShowEmojiPanel}
                                            >
                                                <EmojiEmotionsIcon color="primary" />
                                            </IconButton>
                                            <IconButton
                                                className='chat-send-button'
                                                type='submit'
                                            >
                                                <SendIcon color="primary" />
                                            </IconButton>
                                        </Form>
                                    </div>
                                </>
                            :
                            <span className='chat-noconversation'>
                                Open a conversation to start a Chat
                            </span>

                        }
                    </div>
                </div>
                <div className="chat-online">
                    <div className="chat-online-wrapper">
                        <ChatOnline onlineusers={onlineUsers} user={user} setCurrentChat={setCurrentChat} />
                    </div>
                </div>
            </div>

            <NewConversation 
                id={user._id} 
                conversations={conversations} 
                friends={user.Friends} 
                open={openNewConv} 
                handleClose={CloseNewConversation} 
                setConversation={setConversations} 
                setCurrentChat={setCurrentChat} 
                socket={socket.current}
            />

        </div>
    )
}

export default Chat
