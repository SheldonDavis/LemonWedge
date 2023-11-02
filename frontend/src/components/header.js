//header
import React, { useState } from 'react'
import { NavLink, Link} from 'react-router-dom'
import jwt_decode from 'jwt-decode'

//import roles
import ROLES from './roles'

//import hooks
import useAuth from '../hooks/useAuth'

//import logo
import logo from '../img/lemonWedge_wTxt.png'

const Header = (props) => {    
    const [isMenuOpen, setIsMenuOpen] = useState(false)   

    //decode access token and grab roles
    const {auth} = useAuth()
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined
    const roles = decoded?.UserInfo?.roles || []

    //if admin, set to true
    const userIsAdmin = JSON.stringify(roles)?.includes(ROLES.Admin)
    //if editor, set to true
    const userIsEditor = JSON.stringify(roles)?.includes(ROLES.Editor)

    function toggleMenu(){
        setIsMenuOpen((current) => !current);
    }

    function forceCloseDrawer(){        
        setIsMenuOpen(false);
    }

    return(
    <>
        <header>
            <div className='logo'>
                <Link to={'/'} onClick={(e)=>forceCloseDrawer()}>
                    <img src={logo} alt='LemonWedge logo'/>
                </Link>
            </div>
            <nav>
                <span className={isMenuOpen ? `menuButton close` : 'menuButton'} onClick={(e)=>toggleMenu()}>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                <ul className={isMenuOpen ? 'shown' : undefined}>
                    <li>
                        <NavLink to={'/about'} onClick={(e)=>forceCloseDrawer()} >About LemonWedge</NavLink>
                    </li>
                    { auth.accessToken && (
                        <>
                            <li>
                                <NavLink to={'/recipes'} onClick={(e)=>forceCloseDrawer()} end>View Recipes</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/mealplan'} onClick={(e)=>forceCloseDrawer()}>My Meal Plan</NavLink>
                            </li>
                            <li>
                                <NavLink to={'/myAccount'} onClick={(e)=>forceCloseDrawer()}>My Account</NavLink>
                            </li>
                        </>
                    )}
                    { (userIsAdmin || userIsEditor) && (
                        <li>
                            <NavLink to={'/recipes/manage'} onClick={(e)=>forceCloseDrawer()} end>
                                Create a Recipe
                            </NavLink>
                        </li>
                    )}
                    
                    { userIsAdmin&& (
                        <li>
                            <NavLink to={'/admin'} onClick={(e)=>forceCloseDrawer()}>Admin</NavLink>
                        </li>                                
                    )}
                    
                    <li>
                        { auth.accessToken ? (                                
                            <NavLink to={'/logout'} onClick={(e)=>forceCloseDrawer()}>Logout</NavLink>
                            ):(
                            <NavLink to={'/login'} onClick={(e)=>forceCloseDrawer()}>Login</NavLink>
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