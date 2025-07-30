import React, { useContext, useEffect } from 'react'
import { usercontext } from '../context/Maincontext'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/ApiConfig'


const NavigatedUser = () => {

   const logged= JSON.parse(localStorage.getItem("logged"))
    const {setposts,followers,following,users,posts,setfollowers,fetchUsersData,fetchAllUsers}=useContext(usercontext)
    const navigate= useNavigate()
    const {id}= useParams()

    const selected= users?.find(u=>u._id ===id)
    const postSelected = posts?.posts?.filter(post => post.createdBy?._id === id);
    
    
    const fetchAllPosts=async()=>{
    try {
      const {data}= await axios.get("/posts/all", {withCredentials:true})
      setposts(data)
    } catch (error) {
      console.log(error);
    }
  }
    
    useEffect(() => {
      fetchAllPosts()
    }, [])
    

  
  const followUser=async(id)=>{
    try {
      await axios.patch(`/users/follow/${id}`,{},{withCredentials:true})
      fetchUsersData()
      fetchAllUsers()
    } catch (error) {
      console.log("Error following user:", error);
    }
  }

  const UnfollowUser=async(id)=>{    
    try {
      await axios.patch(`/users/unfollow/${id}`,{},{withCredentials:true})
      fetchUsersData()
      fetchAllUsers()
    } catch (error) {
      console.log("Error Unfollowing user:", error);
    }
  }


  return (
   <div className="lg:w-full w-screen min-h-screen font-sans mt-10 lg:mt-0">

  <div className="flex flex-col items-center gap-6 px-4 py-6 border-b border-gray-300">
    {selected && (
      <div className="flex flex-col items-center w-full gap-6">
       
        <img
          className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border shadow-md"
          src={selected?.profile?.avatar}
          alt="avatar"
        />

        <div className="flex flex-col items-center gap-3 w-full">
        
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            <h2 className="text-2xl font-semibold">{selected?.username}</h2>
          </div>

          <div className="flex gap-6 text-sm justify-center">
            <p className="flex flex-col items-center">
              <strong className="text-xl">{postSelected?.length || 0}</strong>
              Posts
            </p>
            <p className="flex flex-col items-center">
              <strong className="text-xl">{selected?.followers?.length || 0}</strong>
              Followers
            </p>
            <p className="flex flex-col items-center">
              <strong className="text-xl">{selected?.following?.length || 0}</strong>
              Following
            </p>
          </div>

       
          {following?.find(f => f._id === selected?._id) ? (
            <button
              onClick={() => UnfollowUser(selected?._id)}
              className=" w-1/2 md:w-[160px] px-3 py-1.5 md:py-2 rounded text-xs md:text-sm transition bg-blue-600 text-white"
            >
              Following
            </button>
          ) : (
            <button
              onClick={() => followUser(selected?._id)}
              className="text-white bg-blue-600 w-1/2 md:w-[160px] px-3 py-1.5 md:py-2 rounded text-xs md:text-sm transition hover:bg-blue-700"
            >
              Follow
            </button>
          )}

    
          <div className="text-sm mt-2 text-center font-[poppins] w-full">
            <p className="font-semibold text-xl">{selected?.profile?.fullName}</p>
            <p className="mt-1">{selected?.profile?.bio}</p>
            <p className="flex items-center gap-1 justify-center font-semibold mt-1">
              <i className="ri-map-pin-line text-green-500 text-xl"></i>
              {selected?.profile?.location}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>


  <div className="w-full border-t border-gray-200">
    {postSelected?.length < 1 ? (
      <p className="font-[roboto] font-semibold text-center py-6 text-gray-500">
        No Posts Yet...
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {postSelected?.map((post) => (
          <div
            key={post._id}
            className="relative border rounded-lg overflow-hidden group shadow-sm"
          >
            <img
              className="w-full h-64 lg:object-cover"
              src={post?.post}
              alt="post"
            />
          
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex justify-center items-center gap-4">
         
            </div>
            <p className="p-2 text-sm font-[roboto condensed]">
              {post.caption}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  )
}

export default NavigatedUser