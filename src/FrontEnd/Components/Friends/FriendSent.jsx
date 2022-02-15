import { useEffect, useState } from "react";
import axios from "axios";

const FriendSent = ({user, refresh}) => {

    const [requestsent, setRequestSent] = useState([]);

    useEffect(()=>{
        user.PendingSent.forEach((key, index)=>{
            axios.get(`${localStorage.getItem('url')}/user/getfriend/${key._id}`)
            .then((response)=>{
                setRequestSent(prevState =>[...prevState, response.data.response])
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
    },[user.PendingSent, refresh])
    
    return ( 
        <>
            {requestsent.map((key, index)=>{     
                return (
                <div className="friends-card">
                    <div className="friends-avatar">
                        <div className="friends-avatar-container">
                            <img src={`${localStorage.getItem('url')}/user/getavatar/${key._id}`} alt="avatar" />
                        </div>
                    </div>
                    <div className="friends-details">
                        <div className="friends-name">
                            {key.Name}
                        </div>
                        <div className="friends-status">
                            <p style={{marginRight: "10px" , color: "grey"}}>Friend Request Sent</p>
                        </div>
                    </div>
                </div>
                )
            })}
        </> 
    );
}
 
export default FriendSent;