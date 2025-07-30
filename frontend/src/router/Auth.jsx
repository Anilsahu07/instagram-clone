import React, { useContext } from 'react'
import { usercontext } from '../context/Maincontext'
import { Navigate } from 'react-router-dom'

const Auth = ({children}) => {
    const {loading}=useContext(usercontext)
    const loggedUser= JSON.parse(localStorage.getItem("logged"))
    console.log(loggedUser);
    

    return loggedUser?.user? children:<Navigate to={`/users/login`}/>
    
}

export default Auth