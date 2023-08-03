import React, {useState, useEffect} from 'react'

//services
import RecipeDataService from '../services/recipe.serv'

//hooks
import useAuth from '../hooks/useAuth'

//icons
import {faBurger, faCircleXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


const CreatingMealplan = ({mealplan=[], addOrRemove}) => {
    //add hook for accessing and using mealplan hook
    const [mealplanRecipes,setMealplanRecipes] = useState({})
    const {auth} = useAuth()
   
    //get the recipes in this mealplan
    const getMealplanRecipes = async () => {
        try{
            await RecipeDataService.getMealplanRecipes(JSON.stringify(mealplan), auth.accessToken)
            .then(data=>{
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
    
    useEffect(()=>{
        getMealplanRecipes()
    },[mealplan])

    
    // console.log(mealplanRecipes)
    console.log('render mealplan box')
    return(
        <>
            <section className='creatingMealplan'>
                <h3>My Mealplan:</h3>
                <div className='mealplanWrapper'>
                    <div className='mealplanRecipeList'>
                        {mealplanRecipes.length &&
                            mealplanRecipes.map((val, i)=>{
                                // console.log(val)
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
                        <button type='button'>Save Mealplan</button>
                    </div>
                </div>
            </section>
        </>
    )
}
export default CreatingMealplan