import React,{useState,useEffect, useRef} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

//hooks
import useAuth from '../hooks/useAuth'
import useArrayList from '../hooks/useArrayList'

//services
import MealplanDataService from '../services/mealplan.serv'

//components
import SingleRecipe from '../components/singleRecipe'

const Mealplan = () => {
    const {auth} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    //getting user ID
    const decoded = auth?.accessToken
    ? jwt_decode(auth.accessToken)
    : undefined
    const userID = decoded?.UserInfo?._id
    const [activePlanExists, setActivePlanExists] = useState(true)
    const [currentPlan, setCurrentPlan] = useState([])
    const [planID, setPlanId] = useState('')
    const [allCooked, setAllCooked] = useState(false)
    //add hook for accessing and using mealplan hook
    const {value,reset,addOrRemove} = useArrayList('mealplan',[])    

    //error message handling
    const errRef=useRef()
    const [errMsg, setErrMsg] = useState('')

    const getMealsData = async (id) => {
        try{
            await MealplanDataService.getMealPlan(id, auth.accessToken)
            .then(res => {
                if(res.data.recipes.length>0){
                    // let tempArray = []
                    let areAllMealsCooked = true
                    res.data.recipes[0].mealplan.map((recipe)=>{
                        if(!recipe.isCooked){
                            areAllMealsCooked = false
                        }
                    })
                    setAllCooked(areAllMealsCooked)
                    setPlanId(res.data.recipes[0]._id)
                    setCurrentPlan(res.data.recipes[0].mealplan)
                }else{
                    setActivePlanExists(false)
                }
            })
            .catch((e)=>{
                console.error(`${e.toString()}`)
                if(!e?.response){
                    setErrMsg('No Server Response')
                }else{
                    setErrMsg(`Error: ${e.response}`)
                }
                errRef.current.focus()
            })
        }catch(e){
            console.error(e)
            setErrMsg('Something went wrong while retrieving the recipe tags. Try again later.')
        }
    }
    
    const markRecipeAsCooked = async (id, toValue) => {
        let data = {
            mealplanID:planID,
            recipeID: id,
            val: toValue,
        }
        // console.log(`${id} will now be ${!toValue?'un':''}cooked`)
        // console.log(data)
        //call API for "toggleRecipeCookStatus" pass through "data"
        try{
            await MealplanDataService.toggleRecipeCookStatus(data,auth.accessToken)
            .then(res => {
                // console.log(res.data.recipes[0].mealplan)
                // let tempArray = []
                // res.data.recipes[0].mealplan.map((recipe)=>{
                //     console.log(recipe)
                //     recipe.recipe[0].isCooked=recipe.isCooked
                //     tempArray.push(recipe.recipe[0])
                // })
                // console.log(tempArray)
                // setPlanId(res.data.recipes[0]._id)
                // setCurrentPlan(res.data.recipes[0].mealplan)
                
                getMealsData(userID)
            })
            .catch((e)=>{
                console.error(`${e.toString()}`)
                if(!e?.response){
                    setErrMsg('No Server Response')
                }else{
                    setErrMsg(`Error: ${e.response}`)
                }
                errRef.current.focus()
            })
        }catch(e){            
            console.error(e)
            setErrMsg(`Something went wrong while marking a recipe as ${!toValue?'un':''}cooked. Try again later.`)
        }
    }

    useEffect(() => {
        getMealsData(userID)
        if(location.search.includes('clearLocal')){
            reset()
            navigate('/mealplan')
        }
      },[])

    const closeMealplanToStartNew = async () => {
        //planID = plan to close
        let data = {
            mealplanID:planID,
        }
        try{
            await MealplanDataService.closeActiveMealplan(data,auth.accessToken)
            .then(res => {            
                
                navigate('/recipes/')              
                //getMealsData(userID)
            })
            .catch((e)=>{
                console.error(`${e.toString()}`)
                if(!e?.response){
                    setErrMsg('No Server Response')
                }else{
                    setErrMsg(`Error: ${e.response}`)
                }
                errRef.current.focus()
            })
        }catch(e){            
            console.error(e)
            setErrMsg(`Something went wrong while closing a mealplan. Try again later.`)
        }
    }
    /**
     * TO-DO
     * 1.pull current logged in user non complete mealplan - &check;
     * 2.display recipes from mealplan - &check;
     * 3.click recipes to view full ingredients and instructions - &check;
     * 4.button to mark as cooked - &check;
     * 5.show old mealplans -- ??? maybe
     * 
    **/
    return(
        <>
            {
                !activePlanExists&&
                <>
                    <p>You don't seem to have an active mealplan built.</p>
                    <p><Link to={`/recipes/`} className='btn'>Build a mealplan?</Link></p>
                </>
            }
        
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
            {
            allCooked&&
            <>  
            <div className='stickyInteract floatingNotificationBar onscreen'>                
                <p>All recipes have been cooked.</p>
                <p><button type='button' onClick={()=>{closeMealplanToStartNew()}}>Start a new mealplan?</button></p>
                {/* <p><Link to={`/recipes/`} className='btn'>start a new mealplan?</Link></p> */}
            </div>
            </>
            }
            <section className='recipesList'>
                {currentPlan.map((recipe, i)=>{
                    return <SingleRecipe 
                        recipe={recipe.recipe[0]} 
                        forMealplan={true}
                        addOrRemove={markRecipeAsCooked}//use this to call function that marks item as cooked/uncooked
                        isCooked={recipe.isCooked}
                        key={recipe._id} 
                    />
                })}
            </section>
        </>
    )
}
export default Mealplan