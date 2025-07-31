import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usercontext } from '../context/Maincontext'
import axios from '../api/ApiConfig'
import { toast } from 'react-toastify'


const Create = () => {
  const [caption, setCaption] = useState('')
  const [post, setPost] = useState(null)
  const [preview, setPreview] = useState(null)
  const {fetchAllPosts}=useContext(usercontext)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setPost(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData()
      formData.append("file", post)
      formData.append("upload_preset", "instagram")
      formData.append("cloud_name", "dhlpuo6te")

      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dhlpuo6te/image/upload", {
        method: "POST",
        body: formData
      })

      const cloudinaryData = await cloudinaryRes.json()
      const imageUrl = cloudinaryData.secure_url

      // 2. Send post data with image URL to your backend
      const { data } = await axios.post("/posts/create", {
        caption,
        post:imageUrl
      }, {
        withCredentials: true
      })
      fetchAllPosts()
      setPost(data)
      toast.success("Post Uploaded successfully")
      navigate("/")
    } catch (error) {
      console.log("Error creating post:", error)
      toast.success("NetWork Issue")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 px-4 lg:w-full w-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full lg:w-2/3 flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 leading-6">Create New Post</h2>

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="lg:w-2/3 w-full h-64 object-cover rounded-xl mb-4"
          />
        )}

        {/* Image Upload */}
        <label className="flex flex-col items-center justify-center lg:w-2/3 w-full lg:h-32 h-20 lg:p-0 p-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className="text-gray-600 lg:text-sm text-[12px]">Click to upload image</span>
        </label>

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          rows="3"
          className="lg:w-2/3 w-full p-3 border border-gray-300 rounded-xl mb-4 text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="lg:w-1/4 w-2/3 lg:py-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition"
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default Create
