import React, { useContext, useEffect } from 'react'
import { usercontext } from '../context/Maincontext'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/ApiConfig'


const Profile = () => {
    const{setusers,setsingleUser,singleUser,getLoggedUser}=useContext(usercontext)
    const {register,handleSubmit,reset}=useForm()
    const {id}= useParams()
    const navigate=useNavigate()
  //  const profile= JSON.parse(localStorage.getItem("logged"))
    
    const submitProfile=async(details)=>{
        const {data}= await axios.patch(`/users/profile/update/${id}`,details,{withCredentials:true})
        setsingleUser(data)
        getLoggedUser()
        localStorage.setItem("logged",JSON.stringify(data))  
        navigate("/")
    }


    useEffect(() => {
      if (singleUser?.isProfileComplete) {
        navigate("/")
      }
    }, [])
    




  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-50 lg:w-full w-screen">
      <div className="border border-gray-300 w-full max-w-sm p-6 bg-white rounded-md shadow-sm">
        <h1 className="text-2xl font-[pacifico] text-center mb-6 text-black">Instagram</h1>
        <h2 className="text-center text-gray-600 text-sm mb-4 font-medium">
          Complete your profile to get started
        </h2>
        <form onSubmit={handleSubmit(submitProfile)} className="flex flex-col gap-3 text-black">
          <input
            {...register("fullName",{required:true})}
            placeholder="Full Name"
            className="text-sm p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("bio",{required:true})}
            placeholder="Bio"
            className="text-sm p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("avatar",{required:true})}
            type='url'
            placeholder="Avatar URL"
            className="text-sm p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("website")}
            placeholder="Website (optional)"
            className="text-sm p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
         <select className="text-sm p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-400" {...register("gender",{required:true})}>
            <option value="male">Male</option>
            <option value="female">Female</option>
         </select>
          <input
            {...register("location",{required:true})}
            placeholder="Location (optional)"
            className="text-sm p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("birthday",{required:true})}
            type='date'
            placeholder="Birthday"
            className="text-sm p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 text-white py-2 rounded font-semibold text-sm mt-1"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile