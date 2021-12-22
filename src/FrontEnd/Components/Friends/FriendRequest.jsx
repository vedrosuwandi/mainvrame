import { useEffect , useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';

import Cookies from 'js-cookie';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Stack from '@mui/material/Stack';

import IconButton from '@mui/material/IconButton';


const FriendRequest = ({user }) => {

    const [requests, setRequests] = useState([]);

    const [status , setStatus] = useState(null);

    const [message , setMessage] = useState(null);

    useEffect(()=>{
        user.PendingReceive.forEach((key, index)=>{
            axios.get(`${localStorage.getItem('localhost')}/user/getfriend/${key._id}`)
            .then((response)=>{
                setRequests(prevState => [...prevState, response.data.response])
            }).catch((error)=>{
                console.log(error)
            })
        })
    },[ user.PendingReceive])

 
    const accept = (id)=>{
        // console.log(id)
        axios.post(`${localStorage.getItem('localhost')}/user/addfriend/${id}`,
        {
            id : id
        }, {
            headers : {
              Authorization :  "Bearer " + Cookies.get('token')
            }
        } )
        .then((response)=>{
            setStatus(true);
            setMessage(response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 1000)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const reject = (id)=>{
        axios.post(`${localStorage.getItem('localhost')}/user/removepending/${id}`,
        {
            id : id
        }, {
            headers : {
              Authorization :  "Bearer " + Cookies.get('token')
            }
        } )
        .then((response)=>{
            setStatus(false);
            setMessage(response.data.message);
            setTimeout(()=>{
                window.location.reload();
            }, 1000)
        }).catch((err)=>{
            console.log(err)
        })
    }



    return ( 
        <>
            {
                status === null ? 
                <></>
                :
                status ? 
                <Alert severity="success">{`${message}`}</Alert>
                :
                <Alert severity="error">{`${message}`}</Alert>
            }
            {requests.map((key, index)=>{
                return(
                    <div className="friends-card" key={index}>
                        <div className="friends-avatar">
                            <img src={`${localStorage.getItem('localhost')}/user/getavatar/${key._id}`} alt="avatar" />
                        </div>
                        <div className="friends-name">
                            {key.Name}
                        </div>
                        <div className="friends-action">
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
                                                xs : '10px'
                                            },
                                            
                                        }}
                                        onClick={() => accept(key._id)}
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
                                        onClick={(id) => reject(key._id)}
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