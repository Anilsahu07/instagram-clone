import React, { useContext, useEffect} from 'react'
import { usercontext } from '../context/Maincontext';
import axios from '../api/ApiConfig'
import { Link, useNavigate } from 'react-router-dom';


const UserProfile = () => {
// const profile= JSON.parse(localStorage.getItem("logged"))
const {setposts,singlePost, setsinglePost,followers,following,setsingleUser,singleUser,getLoggedUser}=useContext(usercontext)
const navigate= useNavigate()


const fetchSinglePost=async()=>{
    try {
      const {data}=await axios.get(`/posts/`,{withCredentials:true})
      setsinglePost(data.posts)
    } catch (error) {
      console.log(error);
    }
}

useEffect(() => {
  fetchSinglePost()
}, [])


  const deletePost=async(id)=>{
    const del= await axios.delete(`/posts/${id}`)
    setposts(del)
    fetchSinglePost()
  }


  const editPost=async(id)=>{
    navigate(`/post/update/${id}`)
  }




  return (
 <div className="flex flex-col h-auto lg:w-full w-screen lg:mt-0 lg:mb-0">
  
  <h2 className="text-xl md:text-2xl font-semibold  top-0 border-b p-3 text-center bg-black text-white">
    {singleUser?.username}
  </h2>

  <div className="flex flex-col lg:w-full w-screen items-center lg:gap-5 gap-2 lg:items-center lg:p-5 p-3">
    <div className='flex lg:gap-10 gap-2 justify-center'>
      <div className='flex flex-col gap-2 w-full items-center'>
         <img
        className="w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border shadow-md"
        src={singleUser?.profile?.avatar}
        alt="avatar"
      />

          <div className='flex flex-col items-center font-[poppins]'>
            <p className="lg:text-sm text-[14px] leading-4 text-center">{singleUser?.profile?.bio}</p>
            <p className="flex items-center gap-1 font-semibold justify-center text-[12px]  mt-1">
            <i className="ri-map-pin-line text-green-500 lg:text-sm text-[12px]"></i>
            {singleUser?.profile?.location}
            </p>
        </div>
      </div>
     

      <div className="text-sm font-[poppins] text-center w-full mt-2 lg:gap-2 flex flex-col">
      
        <div className='flex flex-col gap-1 items-start'>
          <p className="font-semibold lg:text-xl text-center text-[12px] leading-4">{singleUser?.profile?.fullName}</p>

        <div className="flex justify-center lg:gap-5 gap-2 text-sm text-center">
        <p className="flex flex-col items-center lg:text-sm text-[10px]">
          <strong className="lg:text-lg text-[13px]">{singlePost?.length || 0}</strong>
          Posts
        </p>
        <p className="flex flex-col items-center lg:text-sm text-[10px]">
          <strong className="lg:text-lg text-[13px]">{followers?.length || 0}</strong>
          Followers
        </p>
        <p className="flex flex-col items-center lg:text-sm text-[10px]">
          <strong className="lg:text-lg text-[13px]">{following?.length || 0}</strong>
          Following
        </p>
      </div>
        </div>

       <div className="flex flex-col items-start justify-center gap-3 w-full">
          <Link
            to={`/user/profile-data/${singleUser?._id}`}
            className="lg:text-sm  text-[11px] px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-gray-800 transition text-center"
          >
            Edit Profile
          </Link>
        </div>

      </div>
    </div>
  
  </div>


  <div className="lg:w-full w-screen border-t-2 border-gray-200 flex flex-wrap justify-center">
    {Array.isArray(singlePost) && singlePost.length < 1 ? (
      <div className="py-6 text-center text-gray-500 font-[roboto] font-semibold">
        No Posts Yet...
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4 font-[roboto condensed]">
        {singlePost.map((p) => (
          <div
            key={p._id}
            className="relative border rounded-lg overflow-hidden group shadow-sm"
          >
            <img
              className="lg:w-64 lg:h-64 object-cover"
              src={p.post}
              alt="post"
            />
        
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center gap-3">
              <button
                onClick={() => editPost(p._id)}
                className="text-white font-bold px-4 py-1 border border-white rounded hover:bg-white hover:text-black transition"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(p._id)}
                className="text-red-400 font-bold px-4 py-1 border border-red-400 rounded hover:bg-red-500 hover:text-white transition"
              >
                Delete
              </button>
            </div>
            <p className="p-2 text-sm font-[roboto condensed]">{p?.caption}</p>
          </div>
        ))}
      </div>
    )}
  </div>
</div>


  );
}

export default UserProfile