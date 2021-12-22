import { useEffect, useState } from "react";
import axios from "axios";

const FriendSent = ({user}) => {

    const [requestsent, setRequestSent] = useState([]);

    useEffect(()=>{
        user.PendingSent.forEach((key, index)=>{
            axios.get(`${localStorage.getItem('localhost')}/user/getfriend/${key._id}`)
            .then((response)=>{
                setRequestSent(prevState =>[...prevState, response.data.response])
            }).catch((err)=>{
                console.log(err);
            })
        })
    },[user.PendingSent])
    return ( 
        <>
            {requestsent.map((key, index)=>{     
                return (
                <div className="friends-card">
                    <div className="friends-avatar">
                        <img src={`${localStorage.getItem('localhost')}/user/getavatar/${key._id}`} alt="avatar" />
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