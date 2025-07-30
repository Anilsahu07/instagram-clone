import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from '../api/ApiConfig'
import { usercontext } from '../context/Maincontext'


const EditProfile = () => {
    const {id}= useParams()
    const {register,handleSubmit,reset}= useForm()
    const {singleUser,setsingleUser,getLoggedUser}=useContext(usercontext)
    const navigate= useNavigate()
    console.log(singleUser);
    

    useEffect(() => {
      reset(singleUser?.profile)
    }, [])
    
    
    const submitProfile=async(profileDetails)=>{
        try {
        const {data}= await axios.patch(`/users/profile/data-update/${id}`,profileDetails, {withCredentials:true})
        setsingleUser(data); 
        getLoggedUser()
        navigate("/user/profile")
        } catch (error) {
            console.log(error);
        } 
    }

    
  return (
    <div className="min-h-screen flex items-center justify-center p-2 lg:w-full w-screen">
      <div className="border border-gray-300 w-full max-w-sm p-6 rounded-md shadow-sm">
        <h1 className="lg:text-2xl text-3xl font-[pacifico] text-center mb-6 ">Instagram</h1>
        <h2 className="text-center text-gray-600 text-sm mb-4 font-medium">
          Complete your profile to get started
        </h2>
        <form onSubmit={handleSubmit(submitProfile)} className="flex flex-col gap-3">
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="text-sm p-2 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("bio")}
            placeholder="Bio"
            className="text-sm p-2 text-black border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("avatar")}
            type='url'
            placeholder="Avatar URL"
            className="text-sm p-2 text-black border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("website")}
            placeholder="Website (optional)"
            className="text-sm p-2 text-black border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
         <select className="text-sm p-2 text-black border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400" {...register("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
         </select>
          <input
            {...register("location")}
            placeholder="Location (optional)"
            className="text-sm p-2 text-black border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            {...register("birthday")}
            type='date'
            placeholder="Birthday"
            className="text-sm p-2 text-black border border-gray-300 rounded bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 text-white py-2 rounded font-semibold text-sm mt-1"
          >
            Update Profile!!
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile