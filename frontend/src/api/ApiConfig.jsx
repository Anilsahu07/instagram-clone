import axios from 'axios'

const instance= axios.create({
    baseURL:"https://instagramclone-o89t.onrender.com/",
    withCredentials:true
})

export default instance