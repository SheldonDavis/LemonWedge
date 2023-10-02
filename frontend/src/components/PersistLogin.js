import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth.js'
import useLocalStorage from '../hooks/useLocalStorage'

//icons
import {faSpinner, faEllipsis} from '@fortawesome/free-solid-svg-icons'
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

    const loadingTextOptions = [
        'Boiling water',
        'Preheating oven',
        'Firing up the grill',
        'Chopping onions',
        'Toasting bread',
        'Mincing garlic',
        'Zesting lemons',
        'Preparing marinade',
        'Peeling potatoes',
    ]
    const [textOption, setTextOption] = useState(Math.floor(Math.random()*loadingTextOptions.length))

    if(isLoading){ 
        setTimeout(function(){
            setTextOption(Math.floor(Math.random()*loadingTextOptions.length))
        },2000)
    }
       


    return(
        <>
            {!persist
                ?<Outlet/>
                :isLoading  
                    ?<>
                        {/* <FontAwesomeIcon icon={faSpinner} spin /> */}
                        <p className='LoadingText'><i>{loadingTextOptions[textOption]} </i><FontAwesomeIcon icon={faEllipsis} fade /></p>
                    </>
                    :<Outlet/>
            }
        </>
    )

}

export default PersistLogin