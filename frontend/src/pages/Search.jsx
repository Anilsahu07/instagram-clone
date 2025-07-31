import React, { useContext, useEffect, useState } from 'react'
import { usercontext } from '../context/Maincontext'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const [search, setsearch] = useState(null)
  const [images, setimages] = useState([])
  const [fashion, setfashion] = useState([])
  const {users,singleUser}=useContext(usercontext)
  const navigate=useNavigate()

  const showUsers= users?.filter(s=>(
      [s.profile.fullName,s.username].some(field=>
        field.toLowerCase().includes(search)
      )
    ))
  

  const navigateTo=(id)=>{
    if (singleUser?._id===id) {
      navigate("/user/profile")
    }else{
      navigate(`/user/profile/${id}`)
    }
  }


const fetchImages = async () => {
  const res = await fetch("https://api.unsplash.com/search/photos?query=food", {
    headers: {
      Authorization: "Client-ID LiF9BJrKtP1GELwF2Vl8WMJhiffP8lDfKpfdvCFk_1M"
    }
  });
  const data = await res.json();
  setimages(data.results)
};

const fetchFaishonImages= async()=>{
  const res= await fetch("https://api.unsplash.com/search/photos?query=fashion", {
    headers: {
      Authorization: "Client-ID LiF9BJrKtP1GELwF2Vl8WMJhiffP8lDfKpfdvCFk_1M"
    }
  })
  const data= await res.json()
  setfashion(data.results)
}


useEffect(() => {
  fetchImages()
  fetchFaishonImages()
}, [])


if (images?.length===0) {
    return <div className="flex justify-center h-screen items-center mt-4">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
  }


  return (
    <div className='flex flex-col items-center lg:w-full w-screen'>
      <div className='lg:w-full w-screen flex items-center gap-0 lg:justify-around justify-center border-b-2 lg:py-7 py-2 px-1 border-gray-200 lg:mt-3 mb-2'>
        <h1 className='font-[pacifico] text-3xl lg:flex hidden'>Instagram</h1>
        <div className='flex items-center justify-center border-l-2 border-white rounded-l-full lg:w-1/3 w-4/5 p-1 lg:gap-1 gap-2'>
            <i className="ri-search-2-line lg:text-3xl text-xl flex items-center lg:flex">  </i>
            <input onChange={(e)=>setsearch(e.target.value)} placeholder='Search...' type="text" className=' rounded-r-full border lg:w-full w-4/5 text-black border-gray-700 text-sm p-2 font-[poppins]' />
        </div>
        <i class="ri-meta-line lg:flex hidden lg:text-3xl text-xl font-semibold"></i>
      </div>
      {search ? (
  <div className="flex flex-col justify-center gap-3 w-full">
    {showUsers?.length > 0 ? (
      showUsers?.map((u) => (
        <div key={u._id} className="flex justify-center gap-2 p-2 border-b">
          <img className="w-12 h-12 rounded-full" src={u?.profile?.avatar} alt="" />
          <div className="flex flex-col">
            <p className="font-semibold text-lg cursor-pointer" onClick={() => navigateTo(u._id)}>
              {u?.username}
            </p>
            <p className="text-sm">{u?.profile?.fullName}</p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center mt-4">No results found</p>
    )}
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
    {images?.map((img) => (
      <img
        key={img.id}
        src={img.urls.small}
        alt={img.alt_description}
        className="w-full h-48 object-cover rounded shadow-md"
      />
    ))}
    {
      fashion?.map((img)=>(
         <img
        key={img.id}
        src={img.urls.small}
        alt={img.alt_description}
        className="w-full h-48 object-cover rounded shadow-md"
      />
      ))
    }
  </div>
)}

    </div>
  )
}


export default Search