
import React, {useEffect, useState} from 'react'
import Navbar from '../Components/Header/Navbar';
import Unity , { UnityContent } from 'react-unity-webgl';
import axios from 'axios';

import "../Style/Dashboard.css";
import Cookies from 'js-cookie';


// create new unity content 
const unityContent = new UnityContent(
    '../../Game/WebGLversion.json',
    '../../Game/UnityLoader.js'
)

const Dashboard = ({user, logout}) => {

    const [currency, setCurrency] = useState(user.Currency);

    //Initialize
    useEffect(()=>{

        //Check if the access token is exist
        if(localStorage.getItem("refreshToken") === null){
            window.location.href="/"
        }else{
            setCurrency(user.Currency);
        }
    },[user.Currency])


    // render when the currency is changed
    useEffect(()=>{
        if(!currency){
            return null
        }
        //set the currency value 
        setCurrency(currency);
        //show directly into display
        point();
    // eslint-disable-next-line
    },[currency])


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
    
    // Show user name on the unity
    unityContent.on("UnityRequestName", (params) => {
        console.log('UnityRequestName', params);
        send();
    })

    // Show currency on the unity
    unityContent.on("UnityRequestCurrency", (params) => {
        // console.log('UnityRequestCurrency', params);
        point();
    })
    
    // update the currency as the player is interacting with something
    unityContent.on("UnityUpdateCurrency", (amount) => {
        // call add point function
        addpoint(amount);
    })

    unityContent.on("UnityDeductCurrency" , (amount)=>{
        //call subtract point function
        if(processCurrency() <= 0){
            console.log("Insufficient Point");
        }else{
            subtractpoint(amount)
        }
    })
    
    //React to Unity
    const send = ()=>{
        unityContent.send(
            "UnityReact",
            "ToUnitySendName",
            user.Username
        )
    }

    const point = ()=>{
        unityContent.send(
            "UnityReact",
            "ToUnitySendCurrency",
            processCurrency()
        )
        // console.log((currency.high * Math.pow(2 , 32)) + currency.low)
    }

    // process the long (Currency)
    const processCurrency = ()=>{
        var value;
        if( currency.low < 0){
            value = currency.high * Math.pow(2 , 32) + currency.low + Math.pow(2 , 32)
        }else{
            value = currency.high * Math.pow(2 , 32) + currency.low
        }
        return value.toString();
    }

    // add user Currency
    const addpoint = async (amount)=>{
        await axios.post('http://localhost:3003/user/addpoint' , {
            Amount : amount
        },{
            headers : {
                Authorization : 'Bearer ' + Cookies.get('token')
            }
        }).then((response)=>{
            setCurrency(response.data.user.Currency);
        }).catch((err)=>{
            console.log(err);
        })
    }

    // subtract user currency
    const subtractpoint = async (amount) =>{
        await axios.post('http://localhost:3003/user/subtractpoint' , {
            Amount : amount
        }, {
            headers : {
                Authorization : 'Bearer ' + Cookies.get('token')
            }
        }).then((response)=>{
            setCurrency(response.data.user.Currency);
        }).catch((err)=>{
            console.log(err);
        })
    }


    // To prevent Error when retrieving Nested Document
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
