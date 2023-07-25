import {Routes, Route} from 'react-router-dom'

//import pages
//public
import Login from '../pages/login'
import CreateAccount from '../pages/createAccount'
import Unauthorized from '../pages/unauthorized'
import Missing from '../pages/missing'
import About from '../pages/about'

//private
import RecipeList from '../pages/recipeList'
import Recipe from '../pages/recipe'
import ManageRecipe from '../pages/manageRecipe'
import Logout from '../pages/logout'
import Admin from '../pages/admin'
import MyAccount from '../pages/myAccount'

//hooks
import useAuth from '../hooks/useAuth'

//additional modules
import PersistLogin from './PersistLogin'
import RequireAuth from './RequireAuth'
import ROLES from './roles'


const SiteRoutes = (props) => {
    const {auth} = useAuth()
    return (
        <Routes>
            <Route element={<PersistLogin/>}>
                {/* testing */}


                {/* public routes */}
                {/* show all recipes */}
                <Route exact path={'/'} element={<RecipeList/>}/>
                {/* show all recipes */}
                <Route exact path={'/about'} element={<About/>}/>
                {/* unauthorized access */}
                <Route exact path={'/unauthorized'} element= {<Unauthorized/>}/>
                {/* create a user */}
                <Route exact path={'/login/create'} element= {<CreateAccount/>}/>
                {/* log into account */}
                <Route path='/login' Component={
                    (props)=>(
                        <Login {...props}  />//login={login} user={user}
                    )
                }/>
                {/* catchall */}
                <Route path='*' element={<Missing/>}/>



                {/* private routes */}
                {/* user avilable routes */}
                <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}> 
                    {/* show all recipes */}
                    <Route exact path={'/recipes'} element= {<RecipeList/>}/>
                    {/* diplay a specific recipe */}
                    <Route path='/recipes/:id' Component={(props)=>(
                        <Recipe {...props} />//user={user}
                    )}/>
                    {/* process a logout and send user back to login page */}
                    <Route path='/logout' Component={
                        (props)=>(
                        <Logout {...props} auth={auth.user} />//logout={logout} user={user}
                        )
                    }/>
                    <Route path='/myAccount' element={<MyAccount/>}/>
                </Route>
                
                {/* routes for admin AND editors */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]}/>}>  
                    {/* create new recipe page*/}
                    <Route path='/recipes/manage' Component={(props)=>(
                        <ManageRecipe {...props} />//user={user}
                    )}/>

                    {/* update existing recipe */}
                    <Route path='/recipes/manage/:id' Component={(props)=>(
                        <ManageRecipe {...props} />//user={user}
                    )}/>
                </Route>
                
                {/* editor only routes */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Editor]}/>}>  
                    {/* nothing for now */}
                </Route>

                {/* admin only routes */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>  
                    {/* admin page */}
                    <Route path={'/admin'} element={<Admin/>}/>
                </Route>
                
            </Route>
        </Routes>
    )
}

export default SiteRoutes;