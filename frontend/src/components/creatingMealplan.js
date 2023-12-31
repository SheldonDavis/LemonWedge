import React, {useState, useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import { Link } from 'react-router-dom'

//services
import RecipeDataService from '../services/recipe.serv'
import MealplanDataService from '../services/mealplan.serv.js'

//hooks
import useAuth from '../hooks/useAuth'

//icons
import {faBurger, faCircleXmark, faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


const CreatingMealplan = ({mealplan=[], addOrRemove, reset}) => {
    //create mealplan data object
    const [mealplanRecipes,setMealplanRecipes] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [activeClass,setActiveClass] = useState("inactive")

    //decode access token and grab roles
    const {auth} = useAuth()
    const decoded = auth?.accessToken
    ? jwt_decode(auth.accessToken)
    : undefined
    const userID = decoded?.UserInfo?._id
   
    //get the recipes in this mealplan
    const getMealplanRecipes = async () => {
        try{//get recipe data from DB
            await RecipeDataService.getMealplanRecipes(JSON.stringify(mealplan), auth.accessToken)
            .then(data=>{
                //set retrieved recipes
                let recipes = data.data.recipes
                setMealplanRecipes([...recipes])
            })
            .catch(e=>{
                console.error(e)
            })
        }catch(e){
            console.error(e)
        }
    }

    //retrieve all recipe information any time selected meals change
    useEffect(()=>{
        if(mealplan.length>0){
            setActiveClass("active")   
        }else{
            setActiveClass("inactive")         
        }         
        getMealplanRecipes()
    },[mealplan])

    const handleSaveMealplan = async () => {
        try{//write current mealplan to database 

            //create meals data for DB
            let meals = []            
            mealplan.map((val, i)=>{
                let meal = {}
                meal._id = val
                meal.isCooked = false

                return meals.push(meal)
            })

            //create mealplan data to send to DB, including who's creating and set complete to false
            let data = {
                user:userID,
                mealplan:meals,
                isComplete:false,
            }

            //write mealplan data  to DB
            await MealplanDataService.saveMealplan(data)
            .then(res => {
                setIsSubmitted(true)
                setTimeout(()=>{
                    setActiveClass("inactive")
                    reset()  
                    setTimeout(()=>{                      
                        setIsSubmitted(false)
                    },999)
                },5000)
              })
              .catch((e)=>{
                console.error(e)
              })
        }catch(e){
            console.error(e)
        }
    }
    
    return(
            <section className={`creatingMealplan ${activeClass}`}>
                {isSubmitted?(//if user has submitted pending mealplan to database
                <>
                    <p>mealplan saved successfully.<FontAwesomeIcon className='valid' icon={faCheckCircle}/></p>
                    <p><Link to={`/mealplan?clearLocal=true`} className='btn' >View your Mealplan</Link></p>
                </>
                ):(                
                    mealplan.length > 0 &&
                    //pending mealplan has yet to be saved
                <>
                    <h3>My Mealplan</h3>
                    <div className='mealplanWrapper'>
                        <div className='mealplanRecipeList'>
                            {mealplanRecipes.length>0 &&
                                mealplanRecipes.map((val, i)=>{
                                    // deconstruct each meal
                                    const {_id, recipename, description, ingredients, image64, imagename, createdBy, ispro} = val
                                    return (
                                        <div className="MealPlanRecipeOuterWrapper" key={`${_id}`}>
                                            <div className='recipeCircle' >
                                                {image64?(
                                                    <img 
                                                        src={image64} 
                                                        alt={`${recipename} - ${imagename}`} 
                                                    />
                                                ):(
                                                    <FontAwesomeIcon 
                                                        icon={faBurger} 
                                                        className="placeholderRecipeImage"  
                                                    />
                                                )}
                                            </div>
                                            <div className="removeThisRecipe" >
                                                    <FontAwesomeIcon 
                                                        icon={faCircleXmark} 
                                                        onClick={(e)=>addOrRemove(_id)}
                                                    />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                        </div>
                        <div className='meaplanSaveWrapper'>
                            <button type='button' onClick={(e)=>handleSaveMealplan()}>Save Mealplan</button>
                            {/* 
                            <br/>
                            <button type='button' onClick={(e)=>reset()}>Clear</button> 
                            */}
                         </div>
                    </div>
                </>
                 
             )}
            </section>
    )
}
export default CreatingMealplan