import { useState, useEffect } from 'react'
import { useNavigate, useLocation} from 'react-router-dom'

//import services
import UserDataService from '../services/user.serv'

//import hooks
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'

const Users = () =>{
    const [users, setUsers] = useState()
    const navigate = useNavigate()
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()
    
    useEffect(()=>{
        const controller = new AbortController()
        const getUsers = async () => {
            try{                
                const response = await UserDataService.getAll(0, controller.signal)
                // console.log(response.data);
                const userNames = response.data.users.map(user=>user?.username)
                setUsers(userNames);
            }catch(err){
                console.error(err)
                navigate('/login', {state:{from:location}, replace:true})
            }

               
          }
       
        getUsers()
        return () =>{
            controller.abort()
        }

    },[])
    return(
        <section>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i)=> <li key={i}>{user}</li>)}
                    </ul>
                ):(
                    <p>No users to display</p>
                )
            }
        </section>
    )
} 
export default Users