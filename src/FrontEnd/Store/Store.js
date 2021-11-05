import React, { useState, useMemo } from 'react';

export const Context = React.createContext();
export const userContext = React.createContext();

const Store = ({ children }) => {
    const [state, setState] = useState(false);
    const [user, setUser] = useState({});

    const loginstate = useMemo(()=>({
        state, setState
    }), [state, setState]);

    const userLoggedIn = useMemo(()=>({
        user, setUser
    }), [user, setUser]);

    return (
        //Provide a Context with state as its value
        <Context.Provider value={loginstate}>
            <userContext.Provider value={userLoggedIn}>
                {children}
            </userContext.Provider>
        </Context.Provider>
    );
}

export default Store;