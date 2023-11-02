import axios from 'axios'

//url to API
const location = window.location.origin.toString()
const BASE_URL = location+'/api/v1'

//base level api access
export default axios.create({
    baseURL:BASE_URL,
    headers:{
        "Content-type":"application/json"
    }
})

//protected API access
export const axiosPrivate = axios.create({
    baseURL:BASE_URL,
    headers:{
        "Content-type":"application/json"
    },
    withCredentials:true,
})


