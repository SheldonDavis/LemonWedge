import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'

//import hooks
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth.js'
import useLocalStorage from '../hooks/useLocalStorage'

//import components
import Loader from './loader'


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
                    ?<>
                        {/* <FontAwesomeIcon icon={faSpinner} spin /> */}
                        {/* <p className='LoadingText'><i>{loadingTextOptions[textOption]} </i><FontAwesomeIcon icon={faEllipsis} fade /></p> */}
                        <Loader/>
                    </>
                    :<Outlet/>
            }
        </>
    )

}

export default PersistLogin