import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import Home from '../pages/Home'
import Auth from './Auth'
import Create from '../pages/Create'
import Explore from '../pages/Explore'
import Search from '../pages/Search'
import UserProfile from '../pages/UserProfile'
import UnAuth from './UnAuth'
import Update from '../pages/Update'
import Notifications from '../pages/Notifications'
import CreateStory from '../pages/CreateStory'
import NavigatedUser from '../pages/NavigatedUser'
import EditProfile from '../pages/EditProfile'
import Settings from '../pages/Settings'
import Inbox from '../pages/Inbox'
import Chat from '../pages/Chat'


const MainRouter = () => {
  return (
  
        <Routes>
            <Route path='/users/signup' element={<UnAuth><Signup/></UnAuth>}/>
            <Route path='/users/story' element={<Auth><CreateStory/></Auth>}/>
            <Route path='/users/login' element={<UnAuth><Login/></UnAuth>}/>
            <Route path='/users/profile/:id' element={<Auth><Profile/></Auth>}/>
            <Route path='/' element={<Auth><Home/></Auth>}/>
            <Route path='/user/settings' element={<Auth><Settings/></Auth>}/>
            <Route path='/post/update/:id' element={<Auth><Update/></Auth>}/>
            <Route path='/create' element={<Auth><Create/></Auth>}/>
            <Route path='/message' element={<Auth><Inbox/></Auth>}/>
            <Route path='/chat/:id' element={<Auth><Chat/></Auth>}/>
            <Route path='/explore' element={<Auth><Explore/></Auth>}/>
            <Route path='/notification' element={<Auth><Notifications/></Auth>}/>
            <Route path='/search' element={<Auth><Search/></Auth>}/>
            <Route path='/user/profile' element={<Auth><UserProfile/></Auth>}/>
            <Route path='/user/profile/:id' element={<Auth><NavigatedUser/></Auth>}/>
            <Route path='/user/profile-data/:id' element={<Auth><EditProfile/></Auth>}/>
        </Routes>
  )
}

export default MainRouter