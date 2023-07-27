//header
import React from 'react'
import { NavLink, NavNavLink} from 'react-router-dom'
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
                        <NavLink to={'/about'} >About</NavLink>
                    </li>
                    { auth.accessToken && (
                        <>
                            <li>
                                <NavLink to={'/recipes'} end>Recipes</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/mealplan'}>My Meals</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/myAccount'}>My Account</NavLink>
                            </li>
                        </>
                    )}
                    { (userIsAdmin || userIsEditor) && (
                        <>
                            <li>
                                <NavLink to={'/recipes/manage'} end>
                                    Create a Recipe
                                </NavLink>
                            </li>
                            { userIsAdmin&& (
                                <li>
                                    <NavLink to={'/admin'}>admin</NavLink>
                                </li>                                
                            )}
                        </>
                    )}
                    
                    <li>
                        { auth.accessToken ? (                                
                            <NavLink to={'/logout'}>Logout</NavLink>
                            ):(
                            <NavLink to={'/login'}>Login</NavLink>
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