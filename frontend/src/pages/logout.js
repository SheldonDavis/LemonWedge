import {useEffect} from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useLogOut from '../hooks/useLogout'

const Logout = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/login'
  const { setAuth } = useAuth()
  const logout = useLogOut()
  const signOut = async () => {
    await logout()
    navigate(from, {replace:true})
  }
  useEffect(() => {
    signOut()
  })
}

export default Logout;
