import React, { useContext, useState } from 'react'
import { usercontext } from '../context/Maincontext'
import { useNavigate } from 'react-router-dom'
import axios from '../api/ApiConfig'


const CreateStory = () => {

  const [image, setimage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [enableButton, setenableButton] = useState(false)
  const {stories,setstories,fetchAllStories}=useContext(usercontext)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setimage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData()
      formData.append("file", image)
      formData.append("upload_preset", "instagram")
      formData.append("cloud_name", "dhlpuo6te")

      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dhlpuo6te/image/upload", {
        method: "POST",
        body: formData
      })

      const cloudinaryData = await cloudinaryRes.json()
      const imageUrl = cloudinaryData.secure_url

      // 2. Send post data with image URL to your backend
      const { data } = await axios.patch("/users/create/story", {
        image:imageUrl
      }, {
        withCredentials: true
      })
      setstories(data)
      fetchAllStories()
      navigate("/")
    } catch (error) {
      console.log("Error creating Story:", error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 px-4 lg:w-full w-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg lg:w-2/3 w-full flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 leading-6">Upload Story</h2>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
        )}


        <label className="flex flex-col items-center justify-center lg:w-2/3 w-full lg:h-32 h-20 lg:p-0 p-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition mb-4">
          <input
          required
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className="text-gray-600">Click to upload Story</span>
        </label>

        <button
          type="submit"
          className="lg:w-1/4 w-1/2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition"
        >
          Add to Story
        </button>
      </form>
    </div>
  )
}

export default CreateStory