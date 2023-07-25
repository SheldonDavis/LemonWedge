    import {axiosPrivate} from '../api/http-common'

    import { useEffect } from 'react'
    import useAuth from './useAuth.js'
    import useRefreshToken from './useRefreshToken.js'

export const useAxiosPrivate = () => {
    const {auth} = useAuth()
    const refresh = useRefreshToken()
    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config=> {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                if(error?.response?.status === 403 && !prevRequest?.sent){
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                } 
                return Promise.reject(error)
            }
        )
        return() => {//cleanup
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }
    },[auth, refresh])
    return axiosPrivate
    
    }