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



function App() {
    const [isLoggedIn , setLoggedIn ]= useState(false);
    const [user, setUser] = useState({});
    
    // check whether the user is login or not when the page is rendering
    useEffect(()=>{
        getUserData(Cookies.get("token"));
        // eslint-disable-next-line  
    },[])

    //Get the data if the user is logged in
    const getUserData = (token) =>{
        axios.get('http://localhost:3003/user/getuser', {
            headers : {
                Authorization : "Bearer " + token
            }
        })
        .then((response)=>{
            //If the user is not log in
            if(response.data.message === "Authentication Failed!"){
                setLoggedIn(false);
            }else{
                setUser(response.data.mydata);
                setLoggedIn(true);
            }
        }).catch((err)=>{
            if(err.response.status === 401){
                // Generate the new one  by calling the refresh token API
                refresh();
                return
            }
        })
    }

    //refresh the access token as it is expired
    const refresh = ()=>{
        axios.get('http://localhost:3003/auth/refresh' , {
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
                <Route exact path="/" render={() => <Home />}/>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/dashboard" render={()=> <Dashboard isLoggedIn={isLoggedIn} user={user} logout={logOut} /> } />
                <Route exact path="/profile" render={()=> <Profile isLoggedIn={isLoggedIn} user={user} logout={logOut} /> } />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
