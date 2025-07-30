import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import axios from '../api/ApiConfig'
import { usercontext } from '../context/Maincontext'

const Signup = () => {
    const {setusers,fetchAllUsers}= useContext(usercontext)
    const {register,handleSubmit,reset}= useForm()
    const navigate=useNavigate()


    const signupHandler=async(details)=>{
        try {
            await axios.post("/users/signup",details,{withCredentials:true})
            // setusers(data)
            fetchAllUsers()
            reset()
            navigate("/users/login")
        } catch (error) {
            console.log("Signup failed", error);  
        } 
    }


  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-3 p-4'>
        <div className='lg:w-1/4 w-5/6 flex flex-col items-center gap-3 text-center font-[roboto condensed] font-normal text-gray-600 text-sm border p-3'>
            <div className='flex flex-col items-center gap-3'>
                <div className=''>
                    <h1 className='font-[pacifico] text-3xl text-black'>Instagram</h1>
                </div>
                <div className='lg:w-2/3 font-semibold mt-2'>
                    <p className='leading-4'>Sign up to see photos and videos from your friends.</p>
                </div>
                    <Link to={`https://facebook.com`} className='bg-blue-600 text-white rounded lg:w-2/3 flex items-center justify-center gap-1 text-[13px] p-1.5'> <i className="ri-facebook-box-fill text-xl"></i>Log in with Facebook</Link>
            </div>
            <div className='lg:w-2/3 w-full flex items-center justify-center gap-2'>
                <hr className='w-full'/> <p className='text-[13px]'>OR</p> <hr className='w-full' />
            </div>
            <form className='flex flex-col items-center lg:w-full gap-2 p-2' onSubmit={handleSubmit(signupHandler)}>
                <input {...register("number",{required:true})} className='border-gray-400 border w-full lg:w-2/3 p-2 text-[13px]' type="number" placeholder='Mobile Number' />
                <input {...register("username",{required:true})} className='border-gray-400 border lg:w-2/3 w-full p-2 text-[13px]' type="text" placeholder='John-doe' />
                <input {...register("email",{required:true})} className='border-gray-400 border w-full lg:w-2/3 p-2 text-[13px]' type="email" placeholder='user email'/>
                <input {...register("password",{required:true})} className='border-gray-400 border w-full lg:w-2/3 p-2 text-[13px]' type="password" placeholder='user password' />

             <div className='lg:w-2/3 mt-1'>
                <p className='text-[11px] lg:leading-4 font-semibold leading-3'>By signing up, you can agree to our Terms. Data Policy and Cookies Policies.</p>
            </div>

            <button className='bg-blue-600 text-white rounded w-2/3 p-1 flex items-center justify-center gap-1 text-[13px] font-semibold mt-1'>
                Signup
            </button>
            </form>
        </div>
        <div className='lg:w-1/4 mt-1 flex items-center justify-center font-[roboto condensed] border p-2 gap-1'>
            <p className='text-[14px]'>Already have an Account? </p>
            <Link className='text-[13px] text-blue-600' to={`/users/login`}>Login</Link>
        </div>
    </div>
  )
}

export default Signup