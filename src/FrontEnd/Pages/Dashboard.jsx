
import React, {useEffect} from 'react'
import Navbar from '../Components/Header/Navbar';
import Unity , { UnityContent } from 'react-unity-webgl';

import "../Style/Dashboard.css";


// create new unity content 
const unityContent = new UnityContent(
    '../../../Game/WebGLversion.json',
    '../../../Game/UnityLoader.js'
)

const Dashboard = ({isLoggedIn, user, logout}) => {

    useEffect(()=>{
        //Check if the access token is exist
        if(localStorage.getItem("refreshToken") == null){
            alert("Please Login")
            window.location.href="/"
        }
        
    },[])


    //Unity to React
    unityContent.on("quitted", () => {
        console.log('Game quit')
    })

    unityContent.on("loaded", () => {
    console.log('Game loaded')
    })

    unityContent.on("progress", progression => {
    console.log('Game loading', progression)
    })

    unityContent.on("error", message => {
    console.log('Game errored', message)
    })
    

    unityContent.on("UnityRequestName", (params) => {
        console.log('UnityRequestName', params);

        send();
    })
    
    //React to Unity
    const send = ()=>{
        unityContent.send(
            "UnityReact",
            "ToUnitySendName",
            user.Username
        )
    }
    

    if(!user.Contact){
        return null;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                <div className="dashboard-nav">
                    <Navbar user={user} logout={logout} />
                </div>
                <div className="dashboard-content">
                    {/* {user.Contact.Email} */}
                    <Unity unityContent={unityContent} width="100%" height="100%" />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
