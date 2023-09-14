import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

//hooks
import useAuth from '../hooks/useAuth'

//components
import ROLES from '../components/roles' 

//icons
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


const SingleRecipe = React.forwardRef(({ recipe, addOrRemove, mealplan, forMealplan=false, isCooked=false }, ref, ) => { 
    const {auth} = useAuth()
    const decoded = auth?.accessToken
    ? jwt_decode(auth.accessToken)
    : undefined
    const userID = decoded?.UserInfo?._id
    const roles = decoded?.UserInfo?.roles || []
    //if admin, set to true
    const userIsAdmin = JSON.stringify(roles)?.includes(ROLES.Admin)
    //if editor, set to true
    const userIsEditor = JSON.stringify(roles)?.includes(ROLES.Editor)

    //destructure the recipe
    const {_id, recipename, description, ingredients, image64, imagename, createdBy, ispro} = recipe

    const recipeBODY = (
        <>{
                image64
                ?(
                    <p><img src={image64} style={{height:'250px',}} alt={`${recipename} - ${imagename}`}/></p>
                ):(
                    <></>
                )
            }
            <h3>{recipename}</h3>
            <p>{description}</p>
            {/* {
                //if recipe is pro recipe
                ispro?(
                    <p>PRO</p>
                ):<></>
            }
            
            {ingredients?(
                <ul>
                {ingredients.map((ingredient, i)=>(
                    <li key={i}>
                    <p>{ingredient.name}, {ingredient.measurement} {ingredient.note?(<i>{ingredient.note}</i>):(<></>)}</p>
                    </li>
                ))}
                </ul>
            ):(<></>)} */}
            <div className='BTNS'>
                <Link to={`/recipes/${recipe._id}`} className='btn'>View Recipe</Link>
                {forMealplan?(
                <>
                {isCooked?(
                    <button type='button' onClick={(e)=>addOrRemove(recipe._id,false)}>Mark as uncooked</button>
                ):(
                    <button type='button' onClick={(e)=>addOrRemove(recipe._id,true)}>Mark as cooked</button>
                )}
                </>
                ):(
                <>
                {
                    ((userIsAdmin) || (userID===recipe.createdBy && userIsEditor) )&&
                    <Link to={`/recipes/manage/${recipe._id}`} className='btn'>Update</Link>
                }
                {
                    !mealplan?.includes(recipe._id)? (
                        <button type='button' onClick={(e)=>addOrRemove(recipe._id)}>add to mealplan</button>
                    ):(
                        <span>added to mealplan <FontAwesomeIcon className='valid' icon={faCheckCircle}/></span>
                    )
                }
                </>
                )}
            </div>
        </>
    )
    const content = ref
    ?<article className='singleRecipe' ref={ref}>{recipeBODY}</article>
    :<article className='singleRecipe' >{recipeBODY}</article>

    return content

})
export default SingleRecipe