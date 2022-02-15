import { useEffect , useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';

import Cookies from 'js-cookie';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

import IconButton from '@mui/material/IconButton';


const FriendRequest = ({user , refresh}) => {

    const [requests, setRequests] = useState([]);

    const [status , setStatus] = useState(null);

    const [message , setMessage] = useState(null);

    const [open, setOpen] = useState(false);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    };

    useEffect(()=>{
        user.PendingReceive.forEach((key, index)=>{
            axios.get(`${localStorage.getItem('url')}/user/getfriend/${key._id}`)
            .then((response)=>{
                setRequests(prevState => [...prevState, response.data.response])
            }).catch((err)=>{
                if(err.response.status === 401){
                    if(err.response.data.message === "Access Token Expired"){
                        refresh();
                    }
                }else{
                    console.log(err.response);
                }
            })
        })
    },[ user.PendingReceive, refresh])

 
    const accept = (id)=>{
        // console.log(id)
        axios.post(`${localStorage.getItem('url')}/user/addfriend/${id}`,
        {
            id : id
        }, {
            headers : {
              Authorization :  "Bearer " + Cookies.get('token')
            }
        } )
        .then((response)=>{
            setOpen(true);
            setStatus(true);
            setMessage(response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 1000)
        }).catch((err)=>{
            console.log(err.response);
        })
    }

    const reject = (id)=>{
        axios.post(`${localStorage.getItem('url')}/user/removepending/${id}`,
        {
            id : id
        }, {
            headers : {
              Authorization :  "Bearer " + Cookies.get('token')
            }
        } )
        .then((response)=>{
            setOpen(true);
            setStatus(false);
            setMessage(response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 1000)
        }).catch((err)=>{
            console.log(err.response)
        })
    }



    return ( 
        <>
            {
                status === null ? 
                <></>
                :
                status ? 
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert severity="success">{`${message}`}</Alert>
                </Snackbar>
                :
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert severity="error">{`${message}`}</Alert>
                </Snackbar>
            }
            {requests.map((key, index)=>{
                return(
                    <div className="friends-card" key={index}>
                        <div className="friends-avatar">
                            <div className="friends-avatar-container">
                                <img src={`${localStorage.getItem('url')}/user/getavatar/${key._id}`} alt="avatar" />
                            </div>
                        </div>
                        <div className="friends-name">
                            {key.Name}
                        </div>
                        <div className="friendrequest-action" style={{display:'flex' , marginLeft:"auto" , alignItems:"center"}}>
                            <Stack spacing={1} direction="row">
                                <div className="friends-accept" >
                                    <IconButton
                                        size="large"
                                        edge="start"
                                        color="inherit"
                                        aria-label="open drawer"

                                        sx={{
                                            mr:{
                                                sm : '20px',
                                                xs : '5px'
                                            },
                                            
                                        }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            accept(key._id);
                                        }}
                                    >
                                        
                                        <CheckCircleIcon id="action-icon-accept" sx={{  color: "green"}} />
                                        
                                    </IconButton>
                                </div>
                                <div className="friends-reject">
                                    <IconButton
                                        size="large"
                                        edge="start"
                                        color="inherit"
                                        aria-label="open drawer"
                                        sx={{
                                            mr:{
                                                sm : '13px',
                                                xs : '5px'
                                            },
                                            
                                        }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            reject(key._id);
                                        }}
                                    >
                                        <CancelIcon id="action-icon-reject" sx={{ color: "red"}} />
                                    </IconButton>
                                </div>
                            </Stack>
                        </div>
                    </div>
                )
            })}
          
        </>
     );
}
 
export default FriendRequest;