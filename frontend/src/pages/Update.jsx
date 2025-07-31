import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usercontext } from '../context/Maincontext'
import axios from '../api/ApiConfig'
import { toast } from 'react-toastify'


const Update = () => {
    const {id}= useParams()
    const {singlePost,setsinglePost}=useContext(usercontext)
    const selectedPost= singlePost?.find(f=>f._id==id)
    const [caption, setCaption] = useState('')
    const navigate= useNavigate()
    
    console.log(singlePost);
    
    
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


    useEffect(() => {
        if (selectedPost) {
            setCaption(selectedPost?.caption)
        }
    }, [])
    

    const handleUpdate=async(e)=>{
        e.preventDefault()
        const {data}= await axios.patch(`/posts/update/${id}`,{caption},{withCredentials:true})
            if (selectedPost) {
                setsinglePost([...singlePost,data])
                navigate(`/user/profile`)
            }
            toast.success("Post Updated")
    }
    
  return (
    <div className='flex items-center justify-center min-h-screen lg:w-full w-screen bg-gray-800 px-4'>
        <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded-2xl shadow-lg lg:w-2/3 w-screen flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 leading-7">Update your Post</h2>

        

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          rows="3"
          className="lg:w-2/3 w-full p-3 border border-gray-300 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="lg:w-1/ w-1/2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition"
        >
          Update
        </button>
      </form>
    </div>
  )
}

export default Update