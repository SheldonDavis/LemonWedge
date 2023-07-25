// import http from '../api/http-common'
import UserDataService from '../services/user.serv'
import useAuth from './useAuth'

const useLogOut = () => {
    const {setAuth} = useAuth()
    const logout = async () => {
        setAuth({})
        try{
            const response = await UserDataService.logOutUser()
            return response
        }catch(err){
            console.error(err)
        }
    }
    return logout
}
export default useLogOut