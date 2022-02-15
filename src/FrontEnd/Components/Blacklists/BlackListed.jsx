import { useEffect, useState } from "react";

import axios from 'axios';



const Blacklisted = ({user, refresh}) => {

    const [showblacklisted, setShowBlacklisted] = useState([]);
      

    useEffect(()=>{
        user.Blacklisted.forEach((key, index)=>{
            axios.get(`${localStorage.getItem('url')}/user/getfriend/${key._id}`)
            .then((response)=>{
                setShowBlacklisted(prevState => [ ...prevState , response.data.response])
            }).catch((err)=>{
                if(err.response.status === 401){               
                    if(err.response.data.message === "Access Token Expired"){
                        refresh()
                    }
                }else{
                    console.log(err.response);
                }
            })
        
        })
     // eslint-disable-next-line
    },[user, refresh])
    

    return ( 
        <>
        {showblacklisted.map((key, index)=>{
            return(
                <div className="friends-card" key={index} onClick={()=>{window.location.href=`/users/${key.Username}`}}>
                    <div className="friends-avatar">
                        <div className="friends-avatar-container">
                            <img src={`${localStorage.getItem('url')}/user/getavatar/${key._id}`} alt="avatar" />
                        </div>
                    </div>
                    <div className="friends-name">
                        {key.Name}
                    </div>
                </div>
            )
        })}

    </>
    );
}
 
export default Blacklisted;