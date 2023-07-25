import axios from 'axios'

//url where abckend API lives
const BASE_URL = 'http://localhost:5000/api/v1'

//base level api access
export default axios.create({
    baseURL:BASE_URL,
    headers:{
        "Content-type":"application/json"
    }
})

//protected API access
//used for thing like recipe interactions(any logged in user) and user retrieval(admin only) 
export const axiosPrivate = axios.create({
    baseURL:BASE_URL,
    headers:{
        "Content-type":"application/json"
    },
    withCredentials:true,
})


