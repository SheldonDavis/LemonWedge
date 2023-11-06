import axios from 'axios'

//url to API
const location = window.location.origin.toString()
let passingURL = ''
if(location.includes('localhost')){    //For testing. making sure API path is referencing the location of seperate port
    passingURL = 'http://localhost:5000/api/v1'
}else{
    passingURL = location+'/api/v1'
}
const BASE_URL = passingURL

//base level API access
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


