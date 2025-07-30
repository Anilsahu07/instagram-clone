import axios from 'axios'

const instance= axios.create({
    baseURL:"https://instagram-clone-9bg4.onrender.com",
    withCredentials:true
})

export default instance