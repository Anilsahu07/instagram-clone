import React, { useContext } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { usercontext } from '../context/Maincontext'
import axios from '../api/ApiConfig'

const Nav = () => {
  const{setusers}= useContext(usercontext)
  const navigate= useNavigate()
  const profile= JSON.parse(localStorage.getItem("logged"))
  

  const logout=async()=>{
      await axios.get("/users/logout")
      setusers(null)
      localStorage.removeItem("logged")
      navigate("/users/login")
  }
  
  return (
    <div className=''>
      {profile?.user.isProfileComplete? <div className='flex flex-col gap-6'> 
        <div className='flex items-center gap-2'>
          <i class="ri-search-line text-3xl"></i>
          <Link to={`/search`}>Search</Link>
        </div>

        <div className='flex items-center gap-2'>
          <i class="ri-home-5-line text-3xl"></i>
          <Link to={`/`}>Home</Link>
        </div>

        <div className='flex items-center gap-2'>
          <i class="ri-compass-fill text-3xl"></i>
          <Link to={`/explore`}>Explore</Link>
        </div>

        <div className='flex items-center gap-2'>
          <i class="ri-telegram-2-fill text-3xl"></i>
          <Link to={`/message`}>Messages</Link>
        </div>

        <div className='flex items-center gap-2'>
          <i class="ri-notification-fill text-3xl"></i>
          <Link to={`/notification`}>Notifications</Link>
        </div>

        <div className='flex items-center gap-2'>
          <i class="ri-add-box-line text-3xl"></i>
          <Link to={`/create`}>Create</Link>
        </div>

        <div className='flex items-center gap-2'>
          <img className='w-[28px] h-[28px] rounded-full border outline object-cover' src={profile?.user.profile.avatar} alt="" />
          <Link to={`/user/profile`}>Profile</Link>
        </div>

        <div>
         <Link onClick={logout}>Logout</Link>
        </div>
        </div>:
        <div>
          {/* <Link to={`/users/signup`}>Signup</Link> */}
        </div>
        }
    </div>
  )
}

export default Nav