import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router , Switch , Route} from 'react-router-dom';
import Login from './FrontEnd/Pages/Login';
import Register from './FrontEnd/Pages/Register';
import axios from 'axios';
import Cookies from 'js-cookie';

//Pages
import Home from './FrontEnd/Pages/Home';
import Dashboard from './FrontEnd/Pages/Dashboard';
import Profile from './FrontEnd/Pages/Profile';
import Verify from './FrontEnd/Pages/Verify';
import ResetPassword from './FrontEnd/Pages/ResetPassword';
import Friends from './FrontEnd/Pages/Friends';
import Users from './FrontEnd/Pages/Users';

//Splash
import Verified from './FrontEnd/Components/Splash/Verified';
import OnlineError from './FrontEnd/Components/Dialog/OnlineErrorDialog';
localStorage.setItem("localhost", 'http://localhost:3003');


function App() {
    const [isLoggedIn , setLoggedIn ]= useState(false);
    const [user, setUser] = useState({});
    const [requestCount , setrequestCount] = useState();

    // check whether the user is login or not when the page is rendering
    useEffect(()=>{
        getUserData(Cookies.get("token"));
        // eslint-disable-next-line  
    },[])

    //Open Dialog handler when Another User is logged In
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        logOut();
      };
    
  
    const getUserData = (token) =>{
        // Check if there is another user is Logged In
        axios.get(`${localStorage.getItem('localhost')}/online/checktoken`, {
            headers : {
                Authorization : "Bearer " + localStorage.getItem('refreshToken')
            }
        }).then((response)=>{
              //Get the data if the user is logged in
            axios.get(`${localStorage.getItem('localhost')}/user/getuser`,{
                headers : {
                    Authorization : "Bearer " + token,
            }
            })
            .then((response)=>{
                //If the user is not log in
                if(response.data.message === "Authentication Failed"){
                    if(localStorage.getItem('refreshToken')){
                        refresh();
                        window.location.reload();
                    }
                    setLoggedIn(false);
    
                }else{
                    countRequest(token)
                    setUser(response.data.mydata);
                    setLoggedIn(true);
                }
            }).catch((err)=>{
                if(err.response.status === 401){
                    if(err.response.data.message === "Access Token Expired"){
                        refresh()
                    }
                    setLoggedIn(false);
                }
            })
        }).catch((err)=>{
            // If there is another User Logged In
            if(err.response.status === 401){
                if(err.response.data.message === "Refresh Token Expired"){
                    logOut();
                }else{
                    handleOpen()
                }
            }
        })
    }
 

    //refresh the access token as it is expired
    const refresh = ()=>{
        axios.get(`${localStorage.getItem('localhost')}/auth/refresh` , {
            headers : {
                Authorization : "Bearer " + localStorage.getItem("refreshToken")
            }
        })
        .then((response)=>{
            // Remove the expired token from cookies
            Cookies.remove("token");
            // add the new generated token to the cookies
            Cookies.set("token", response.data.token);
            // Retrieve the data again as the token refreshes
            getUserData(response.data.token);
        // When the Refresh Token is Expired
        }).catch((err)=>{
            Cookies.remove("token");
            localStorage.removeItem("refreshToken");
            window.location.href="/"
        })
    }

    // process the long (Currency)
    // const processCurrency = ()=>{
    //     var value;
    //     if( user.Currency.low < 0){
    //         value =  user.Currency.high * Math.pow(2 , 32) +  user.Currency.low + Math.pow(2 , 32)
    //     }else{
    //         value =  user.Currency.high * Math.pow(2 , 32) +  user.Currency.low
    //     }
    //     return value.toString();
    // }

   
    const countRequest = (token)=>{
        axios.get(`${localStorage.getItem('localhost')}/user/countrequest`, {
            headers : {
                Authorization : "Bearer " + token
            }
        }).then((response)=>{
            setrequestCount(response.data.count);
        }).catch((err)=>{
            console.log(err)
        })
    }

    const logOut = ()=>{
        Cookies.remove("token");
        localStorage.removeItem("refreshToken");
        setLoggedIn(false);
        setUser({});
        window.location.href="/";
    }
    
    

  return (
    <div className="App">
        <Router>
            <Switch>
                <Route exact path="/" render={() => <Home refresh={refresh} />}/>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/dashboard" render={()=> <Dashboard isLoggedIn={isLoggedIn} user={user} logout={logOut} /> } />
                <Route exact path="/profile" render={()=> <Profile refresh={refresh} isLoggedIn={isLoggedIn} user={user} logout={logOut} /> } />
                <Route exact path="/friends" render={()=> <Friends user={user} countRequest={requestCount} logout={logOut} />} />
                <Route exact path="/verify/:id"  component={Verify} />
                <Route exact path="/verified/:code"  component={Verified} />
                <Route exact path="/resetpass/:code" component={ResetPassword}  />
                <Route exact path="/users/:username" render={()=> <Users user={user} logout={logOut} />} />
            </Switch>
        </Router>
        <OnlineError open={open} handleClose={handleClose}/>
    </div>
  );
}

export default App;
