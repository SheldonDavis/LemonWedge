import userDataService from '../services/user.serv'
import useAuth from './useAuth'

const useRefreshToken = () => {
    const {setAuth} = useAuth()

    const refresh = async () => {
        try{
            
            const response = await userDataService.refreshToken()
            setAuth(prev=>{
                // console.log(`PREVIOUS ACCES TOKEN = ${JSON.stringify(prev.accessToken)}`)
                // console.log(`NEW ACCESS TOKEN = ${response.data.accessToken}`)
                return {
                    ...prev, 
                    // roles:response.data.roles,
                    accessToken:response.data.accessToken,
                }
            })
            return response.data.accessToken
        }catch(err){
            console.error(err)
        }
    }
    return refresh
}
export default useRefreshToken