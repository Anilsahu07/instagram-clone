import React, { useContext } from 'react'
import { usercontext } from '../context/Maincontext'

const Notifications = () => {
  const {messages,setMessages,comments,singleUser,users}=useContext(usercontext)
  const otherUsers= users?.filter(e=>e._id!==singleUser?._id)
 
  console.log(comments);
  
  
  return (
    <div>
      {
        // singleUser?._id ===
      }
    </div>
  )
}

export default Notifications