//header
import React from 'react'
import { Link, } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import jwt_decode from 'jwt-decode'
import ROLES from './roles'

const Header = (props) => {
    
    const {auth} = useAuth()
   
    //decode access token and grab roles
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined
    const roles = decoded?.UserInfo?.roles || []

    //if admin, set to true
    const userIsAdmin = JSON.stringify(roles)?.includes(ROLES.Admin)
    //if editor, set to true
    const userIsEditor = JSON.stringify(roles)?.includes(ROLES.Editor)

    return(
    <>
        <header>
            <div className='logo'>
                LEMONWEDGE logo
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to={'/about'}>About</Link>
                    </li>
                    { auth.accessToken ? (
                        <>
                            <li>
                                <Link to={'/recipes'}>Recipes</Link>
                            </li>
                            <li>
                                <Link to={'/mealplan'}>My Meals</Link>
                            </li>
                            <li>
                                <Link to={'/myAccount'}>My Account</Link>
                            </li>
                        </>
                    ):<></>}
                    { userIsAdmin || userIsEditor ? (
                        <>
                            <li>
                                <Link to={'/recipes/manage'}>
                                    Create a Recipe
                                </Link>
                            </li>
                            { userIsAdmin ? (
                                <li>
                                    <Link to={'/admin'}>admin</Link>
                                </li>                                
                                ):<></>//show nothing
                                }
                        </>
                    ):<></>}
                    
                    <li>
                        { auth.accessToken ? (                                
                            <Link to={'/logout'}>Logout</Link>
                            ):(
                            <Link to={'/login'}>Login</Link>
                            )
                            }
                    </li>
                      
                </ul>
            </nav>
        </header>
    </>
    )
}

export default Header