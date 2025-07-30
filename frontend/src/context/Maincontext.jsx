import React, { createContext, useEffect, useRef, useState } from 'react'
import axios from '../api/ApiConfig'


export const usercontext= createContext()
const Maincontext = ({children}) => {
const [users, setusers] = useState([])
 const [favPost, setfavPost] = useState([])
const [loading, setloading] = useState(true)
const [followers, setfollowers] = useState([])
const [following, setfollowing] = useState([])
const [posts, setposts] = useState([])
const [stories, setstories] = useState([])
const [comments, setcomments] = useState([])
const [singlePost, setsinglePost] = useState([])
const [singleUser, setsingleUser] = useState(null)
const [messages, setMessages] = useState([])
const [toggleMenu, settoggleMenu] = useState(false);
const [toggle, settoggle] = useState(false)
const [color, setcolor] = useState(`rgb(255,255,255)`)

     const allRef= useRef(null)
     const whiteColor= `rgb(255,255,255)`
     const blackColor= `rgb(0,0,0)`
  
      const changeColor=()=>{
        if (toggle) {
          setcolor(whiteColor)
          settoggle(false)
          localStorage.setItem("whitecolor",JSON.stringify(whiteColor))
          localStorage.removeItem("blackcolor")
  
        }else{
          setcolor(blackColor)
          settoggle(true)
          localStorage.setItem("blackcolor",JSON.stringify(blackColor))
          localStorage.removeItem("whitecolor")
      }
      settoggle(!toggle)

      }
  console.log(singleUser);
  
    useEffect(() => {
      const white= JSON.parse(localStorage.getItem("whitecolor"))
      const black= JSON.parse(localStorage.getItem("blackcolor"))
  
       if (white) {
          setcolor(white)
          settoggle(false)
  
       }else if(black){
          setcolor(black)
          settoggle(true)
       }
    }, [])


  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("comments")) || [];
    setcomments(storedComments);
  }, []);


  useEffect(() => {
   localStorage.setItem("comments",JSON.stringify(comments))
  }, [comments])
  

  const fetchAllUsers=async()=>{
    const {data}= await axios.get("/users/all",{withCredentials:true})
    setusers(data.users)
  }



  const fetchAllPosts=async()=>{
    try {
      const {data}= await axios.get("/posts/all", {withCredentials:true})
      setposts(data)
    } catch (error) {
      console.log(error);
    }finally{
      setloading(false)
    }
  }

  
  const fetchAllStories=async()=>{
    try {
      const {data}= await axios.get("/users/stories",{withCredentials:true})
      setstories(data.stories)
    } catch (error) {
      console.log(error)
    }
  }


  const getLoggedUser=async()=>{
    const {data}=await axios.get("/users/me",{withCredentials:true})
    setsingleUser(data.user)
  }

  const fetchUsersData = async () => {
  try {
    const { data } = await axios.get("/users/data", { withCredentials: true });
    setfollowers(data.followers || []);
    setfollowing(data.following || []);
  } catch (error) {
    console.log("Problem in fetching user's data", error);
  }
};




  useEffect(() => {
    fetchAllUsers()
    fetchAllPosts()
    fetchAllStories()
    getLoggedUser()
    fetchUsersData()
  }, [])
  console.log(posts);
  console.log(singleUser);
  
  
  return (
    <usercontext.Provider value={{setusers,users,loading,setloading,posts,setposts,favPost,setfavPost,setcomments,comments,setsinglePost,singlePost,stories,setstories,setfollowers,setfollowing,followers,following,singleUser,setsingleUser,fetchAllUsers,fetchAllStories, fetchAllPosts,getLoggedUser,fetchUsersData,toggle,settoggle,changeColor,allRef,color,setcolor,messages,setMessages,toggle}}>
          <div ref={allRef} className='w-screen h-fit' style={{backgroundColor:color,color:color===`rgb(0,0,0)`? "white":"black"}}>
            {children}
          </div>
        </usercontext.Provider>
  )
}

export default Maincontext