import React, {useState, useEffect} from 'react'
import RecipeDataService from '../services/recipe.serv'
import {Link, useParams, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'
import jwt_decode from 'jwt-decode'
import ROLES from '../components/roles'

const Recipe = (props) => {
  const axiosPrivate = useAxiosPrivate()
  const initialRecipeState = {
    id: null,
    recipename:'',
    description:'',
    ingredients: [],
  }
  const navigate = useNavigate()
  
  const {auth} = useAuth()
  //decode access token and grab roles
  const decoded = auth?.accessToken
  ? jwt_decode(auth.accessToken)
  : undefined
  const userID = decoded?.UserInfo?._id
  const roles = decoded?.UserInfo?.roles || []

  //if admin, set to true
  const userIsAdmin = JSON.stringify(roles)?.includes(ROLES.Admin)
  //if editor, set to true
  const userIsEditor = JSON.stringify(roles)?.includes(ROLES.Editor)
  //set recipe state data
  const [recipe, setRecipe] = useState(initialRecipeState)

  const {id} = useParams()

  const getRecipe = async (id) => {
    await RecipeDataService.get(id)
    .then(res => {
      setRecipe(res.data)
      //console.log(response.data)
    })
    .catch((e) => {
      console.error(e)
    })
  }
  const goBack = () => {
		navigate(-1);
	}

  useEffect(() => {
    // console.log('getting recipe with ID')
    getRecipe(id)
  },[id])
    return (
      <section className='fullRecipePage'>
        {recipe?(        
          <>
          <div className='fullRecipeTop'>
            {
              recipe.image64&&
                <p className='fullRecipeImage'><img src={recipe.image64} alt={`${recipe.recipename} - ${recipe.imagename}`}/></p>
            }
            <div className='fullRecipeTopText'>
              <h3>{recipe.recipename}</h3>
              <p>{recipe.description}</p>
              {/* <p>is pro: {recipe.ispro?.toString()}</p> */}
              <ul className='ingredientsBulletList'>
                {
                  recipe.ingredients?.map((ingredient, i)=>(
                    <li id={`ingredient_${i}`} key={i}>
                      <strong>{
                        ingredient.name
                      }</strong>{
                        ingredient.measurement
                        ?<>, {ingredient.measurement}</>
                        :<></>
                      } {
                        ingredient.note 
                        ?<i>{ingredient.note}</i>
                        :<></>
                      }
                    </li>
                  ))
                } 
              </ul>
            </div>
          </div>

            <ol className='instructionsOrderedList'>
              {
                recipe.instructions?.map((step, i)=>(
                  <li id={`step_${i}`} key={i}>
                    {step.step}
                  </li>
                ))
              } 

            </ol>

            <div className='RecipePageLinks'>
              <a href="#" onClick={goBack}>Back</a>
              {
                ((userIsEditor || userIsAdmin) && (userID === recipe.createdBy))&&        
                  <>
                    {/* <button onClick={deleteRecipe(recipe._id)}>Delete</button> */}
                    <Link to={{
                      pathname:'/recipes/manage/'+id,
                      
                    }} state={recipe}>Edit</Link>
                  </>
                
              }
            </div>
          </>
          ):(
            <>
              <br/>
              <p>No recipe selected</p>
            </>
          )
        }
      </section>
    );
}

export default Recipe;
