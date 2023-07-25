import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth.js'
import useLocalStorage from '../hooks/useLocalStorage'

//icons
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const {auth} = useAuth()
    const [persist] = useLocalStorage('persist', false)

    useEffect(() => {
        const verifyRefreshToken = async()=>{
            try{
                await refresh()
            }
            catch(err){
                //console.error(err)
            }
            finally{
                setIsLoading(false)
            }
        }
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)
       
    },[])


    return(
        <>
            {!persist
                ?<Outlet/>
                :isLoading  
                    ?<FontAwesomeIcon icon={faSpinner} spin />
                    :<Outlet/>
            }
        </>
    )

}

export default PersistLogin