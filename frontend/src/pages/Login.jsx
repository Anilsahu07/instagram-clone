import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/ApiConfig'
import { usercontext } from '../context/Maincontext'


const Login = () => {
    const {register,handleSubmit,reset}=useForm()
    const {setusers,fetchAllUsers,setsingleUser}=useContext(usercontext)
    

    const loginHandler=async(details)=>{
        try {
            const {data}= await axios.post("/users/login",details,{withCredentials:true})
            // setusers(data)
            setsingleUser(data.user)
            localStorage.setItem("logged",JSON.stringify(data))
            fetchAllUsers()
            reset()
        } catch (error) {
            console.log("Login failed",error);
        }
    }


  return (
     <div className='min-h-screen w-full flex flex-col items-center justify-center gap-2'>
        <div className='lg:w-1/4 w-5/6 flex flex-col items-center gap-1 text-center font-[roboto condensed] font-normal text-gray-600 text-sm border p-3'>
            <div className=''>
                <h1 className='font-[pacifico] text-3xl text-black'>Instagram</h1>
            </div>
            <form className='flex flex-col items-center w-full gap-2 mt-3' onSubmit={handleSubmit(loginHandler)}>
                <input {...register("email")} className='border-gray-400 border lg:w-2/3 w-full p-1 text-[13px]' type="text" placeholder='user email' />
                <input {...register("password")} className='border-gray-400 border lg:w-2/3 w-full p-1 text-[13px]' type="password" placeholder='user password' />
            <button className='bg-blue-600 text-white rounded w-2/3 p-1 flex items-center justify-center gap-1 text-[13px] font-semibold mt-1'>
                Login
            </button>

            </form>
    
            <div className='lg:w-2/3 flex items-center justify-center gap-2'>
                <hr className='w-full'/> <p className='text-[13px]'>OR</p> <hr className='w-full' />
            </div>
            
            <Link to={`https://facebook.com`} className='bg-blue-600 text-white rounded w-2/3 flex items-center justify-center gap-1 text-[13px]'> <i class="ri-facebook-box-fill text-xl"></i>Log in with Facebook</Link>
        </div>
        <div className='lg:w-1/4 mt-1 flex items-center justify-center font-[roboto condensed] border p-2 gap-1'>
            <p className='text-[14px]'>Don't have an Account? </p>
            <Link className='text-[13px] text-blue-600' to={`/users/signup`}>Signup</Link>
        </div>
    </div>
  )
}

export default Login