import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

//custom hooks
import useAuth from '../hooks/useAuth'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'

//services
import RecipeDataService from '../services/recipe.serv'

//components
import IngredientInputs from '../components/ingredientInputs.js'
import InstructionInputs from '../components/instructionsInputs.js'

//icons
import {faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

//roles
import ROLES from '../components/roles'

const  ManageRecipe = () => {
  //using private connection to send through permissions
  const axiosPrivate = useAxiosPrivate()

  //get user info
  const {auth} = useAuth()
  //getting user ID
  const decoded = auth?.accessToken
  ? jwt_decode(auth.accessToken)
  : undefined
  const userID = decoded?.UserInfo?._id
  const roles = decoded?.UserInfo?.roles || []

  //if admin, set to true
  const userIsAdmin = JSON.stringify(roles)?.includes(ROLES.Admin)

  //reference for in the event of errors
  const errRef=useRef()
  const [errMsg, setErrMsg] = useState()

  //used for redirect form edit page if wrong user
  const navigate = useNavigate()
  const location = useLocation()


  //set recipe state data
  const [recipeID, setRecipeID] = useState('')
  const [recipename, setRecipeName] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [instructions, setInstructions] = useState([])
  const [image,setImage] = useState('')
  const [imageName,setImageName] = useState('')
  const [isAcceptableFileType, setIsAcceptableFileType] = useState(true)
  const [isRecipePro, setIsRecipePro] = useState(false)

  const [submitted, setSubmitted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)


  const {id} = useParams()
 
  const getRecipe = async (id) => {
    try{
      if(!id)return
      await RecipeDataService.get(id)
      .then(res => {
        //console.log(res.data)
        if((userID !== res.data.createdBy)&&(!userIsAdmin)){
          navigate('/recipes/manage',{
            replace:true,
            state:{fromEditNoAuth:true},
          })
        }
        setIsEditing(true)
        setRecipeID(res.data._id)
        setRecipeName(res.data.recipename)
        setDescription(res.data.description)
        setIngredients(res.data.ingredients)
        setInstructions(res.data.instructions)
        setImage(res.data.image64)
        setIsRecipePro(res.data.ispro)
        console.log(res.data.ispro)
      })
      .catch((e) => {
        console.error(e)
        setErrMsg(e.response.data.error)
        errRef.current.focus()
      })

    }catch(e){
      console.error(e)
      setErrMsg(e.response.data.error)
      errRef.current.focus()
    }
  }
 
  useEffect(() => {
      if(!id)return//do nothing more
      // console.count(`getting recipe with ID : ${id}`)
      getRecipe(id)
  },[id])
  useEffect(()=>{
    if(location?.state?.fromEditNoAuth ){
      setErrMsg('You are not the requested recipe\'s author, try creating a recipe first.')
      errRef.current.focus()
    }

  },[])


  const handleNameInputChange = (e) => {
    setRecipeName(e.target.value)
    setErrMsg('')
  }
  
  const handleDescriptionInputChange = (e) => {
    setDescription(e.target.value)
    setErrMsg('')
  }

  //ingredients handlers
  const updateIngredient = (name,measurement,note,_id) => {
    //Find the ignedient with the provided id
    const ingredientIndex = ingredients.findIndex((ingredient) => ingredient._id === _id)
    //create new ingedient item with updated content
    const updatedIngredient = Object.assign({}, ingredients[ingredientIndex])
    updatedIngredient.name = name
    updatedIngredient.measurement = measurement
    updatedIngredient.note = note
    updatedIngredient._id = _id
    //Update the ingredients list with the updated ingredient
    const newIngredientItem = ingredients.slice();
    newIngredientItem[ingredientIndex] = updatedIngredient;
    //set ingedients
    setIngredients(newIngredientItem);
  }
  const removeIngredient = (id) => {
    // console.log('removing ingredient:')
    setIngredients(current =>
      current.filter(ingredient => {
        return ingredient._id !== id
      }),
    );
  }
  const addIngredient = (name,measurement,note,_id) => {
    // console.log('adding new ingredient')
    ingredients
    ? setIngredients([...ingredients, {name:name,measurement:measurement,note:note,_id:_id}])
    :setIngredients([{name:name,measurement:measurement,note:note,_id:_id}])

  }

  //instructions hadnlers
  const addNewStep = (_id, stepText) => {
    instructions
    ?setInstructions([...instructions, {_id:_id, step:stepText}])
    :setInstructions([{_id:_id, step:stepText}])
  }
  const updateStep = (_id, stepText) => {
    
    //Find the step with the provided id
    const instructionIndex = instructions.findIndex((step) => step._id === _id)
    //create new step text item with updated content
    const updatedInstruction = Object.assign({}, instructions[instructionIndex])
    updatedInstruction.step = stepText
    updatedInstruction._id = _id
    //Update the instructions list with the updated step text
    const newStep = instructions.slice();
    newStep[instructionIndex] = updatedInstruction;
    //set instructions
    setInstructions(newStep);
  }
  const removeStep = (id)=> {
    setInstructions(current =>
      current.filter(step => {
        return step._id !== id
      }),
    );
  }
  
  //recipe image handlers
  const convertImgToBase64 = (e) => {

    console.log(e.target.files[0])//(1.5e+6)
    //make sure file is not too large
    if(e.target.files[0].size > (1.5e+6)){
      console.log('file to large')
      setErrMsg('uploaded files cannot be larger than 1.5MB')
      errRef.current.focus()
      return
    }
    
    //make sure allowed file type
    let allowedExtensions =  /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(e.target.files[0].name)) {
        setErrMsg('You cannot upload non image files')
        errRef.current.focus()
        setIsAcceptableFileType(false)
        return
    }

    let reader = new FileReader()
    setIsAcceptableFileType(true)

    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => setImage(reader.result)
    reader.onerror = (error) => {
      console.error('Error: ', error)
      setErrMsg(`Error: ${error}`)
      errRef.current.focus()
    }
    setImageName(e.target.files[0].name)
    
  }

  //submit update/create recipe
  const saveRecipe = async () => {
    if(!isAcceptableFileType){
      setErrMsg('An acceptable image must be added for a recipe upload.')
      errRef.current.focus()
      return
    }
    // console.log('begin saving recipe')
    let data = {
      recipename: recipename,
      description: description,
      ingredients:ingredients,
      instructions:instructions,
      image64:image,
      imagename:imageName,
      createdBy: userID,
      ispro: isRecipePro,
    }
    // console.log(data)
    if (isEditing){
      try{

        data.recipe_id = recipeID
        await RecipeDataService.updateRecipe(data)
        .then(res => {
          setSubmitted(true)
          // console.log(res.date)
        })
        .catch((e)=>{
          console.error(e)
          setErrMsg(e.response.data.error || `Error status: ${e.response.status} - ${e.response.statusText}`)
          errRef.current.focus()
        })

      }catch(err){
        if(!err?.response){
          setErrMsg('No Server Response')
        }else if (err.response?.status === 409){
          setErrMsg('Username taken')
        }else{
          setErrMsg('Update failed')
        }

        errRef.current.focus()
      }
    }else{
      try{
        RecipeDataService.createRecipe(data)
        .then(res => {
          setSubmitted(true)
          // console.log(res.date)
        })
        .catch((e)=>{
          
          console.error(e)
          setErrMsg(e.response.data.error)
          errRef.current.focus()
        })
        
      }catch(err){
        if(!err?.response){
          setErrMsg('No Server Response')
        }else if (err.response?.status === 409){
          setErrMsg('Username taken')
        }else{
          setErrMsg('Creation failed')
        }

        errRef.current.focus()
      }
    }
  }

  const newStepID = Math.floor(Math.random()*100000)//instructions ? (instructions?.length+1) : 1
  const newIngredientID = Math.floor(Math.random()*100000)//ingredients ? (ingredients?.length+1) : 1
  return (
        <>
          {submitted ? (
            <section>
              {isEditing?(
                <h4>Your recipe was updated</h4>
              ):(
                <h4>You Submitted a new recipe</h4>
              )}
              <Link to={'/recipes'}>Back to all recipes</Link>
            </section>
          ): (
            <section>
              <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
              <div className='formRow'>
                <label htmlFor='recipeName'>{isEditing? 'Edit' : 'Create'} Recipe Name</label>
                <input type='text' id='recipeName' name='recipename' required value={recipename} onChange={handleNameInputChange}/>
              </div>
              
              <div className='formRow'>
                <p>Is this a premium reicpe?
                  <input 
                    id='recipeIsPro' 
                    type='checkbox' 
                    checked={isRecipePro} 
                    onChange={(event) => setIsRecipePro(event.currentTarget.checked)}
                  />
                  <label htmlFor='recipeIsPro'>Yes</label>

                </p>
                
              </div>

              <div className='formRow'>
              <label htmlFor='description'>{isEditing? 'Edit' : 'Create'} Recipe Description</label>
              <textarea cols='50' rows='5' style={{resize:'none'}} maxLength='250' id='description' name='description' placeholder='A short description.' required value={description} onChange={handleDescriptionInputChange}></textarea>
              </div>
                

              <div className='formRow'>
                <label htmlFor='uploadRecipeImage'>Upload recipe image: </label>
                <input
                id='uploadRecipeImage'
                accept="image/*"
                type='file'
                onChange={convertImgToBase64}
                />
                <img src={image} style={{height:'200px'}} alt={recipename}/>
              </div>

              <div className={`allIngredientsList `}>

                {//loop through all currently added ingredients
                  ingredients
                  ? (ingredients?.map((ingredient, i) => {
                    // newIngredientID = (parseInt(ingredient._id)+1)
                    return(
                    
                      <div className={`ingredientRow ingredient_${(ingredient._id)}`} key={i}  name={`ingredient_${ingredient._id}`}>
                        <button type='button' onClick={(e)=>removeIngredient(ingredient._id)} className={`delete_ingItem_${ingredient._id}`}><FontAwesomeIcon icon={faXmark}/></button>
                        
                        <IngredientInputs ingredientKey={i} name={ingredient.name} measurement={ingredient.measurement} note={ingredient.note} _id={ingredient._id} addNewIngredient={addIngredient} updateIngredient={updateIngredient} newRow={false} setErrMsg={setErrMsg}/>
                        
                      </div>
                    
                    )})
                  ):(
                    <></>
                  )
                }
                {/* create new blank fields */}
                <div className={`ingredientRow ingredient_new_${newIngredientID}`}>
                  <IngredientInputs ingredientKey={`${newIngredientID}`} recipe_id={recipeID} addNewIngredient={addIngredient} setErrMsg={setErrMsg} newRow={true}/>
                  {/* <IngredientInputs ingredientKey={`0`} recipe_id={recipeID} addNewIngredient={addIngredient} setErrMsg={setErrMsg} newRow={true}/> */}
                </div>
              </div>

              {/* intructions item: works similar to ingredients */}
              <div className='allInstructionsList'>
                <p>Intructions:</p>
                <ol>
                  {//loop through all current items in instrucitons state
                    instructions
                      ?(
                        instructions?.map((step, i) => (
                          <li key={i}>
                            
                            <button type='button' onClick={(e)=>removeStep(step._id)} className={`delete_ingItem_${step._id}`}><FontAwesomeIcon icon={faXmark}/></button>
                            <InstructionInputs 
                              instructionKey={`${i}`} 
                              _id={step._id} 
                              step={step.step} 
                              addNewStep={addNewStep} 
                              updateStep={updateStep} 
                              setErrMsg={setErrMsg} 
                              newRow={false}
                            />
                          </li>
                        ))
                      ):(<></>)
                  }
                  <li>{/* create blank instruction input field */}
                    <InstructionInputs 
                      instructionKey={`${newStepID}`} 
                      addNewStep={addNewStep} 
                      updateStep={updateStep} 
                      setErrMsg={setErrMsg} 
                      newRow={true}
                    />
                  </li>
                </ol>
              </div>

              <button onClick={(e)=>{saveRecipe()}} >{isEditing? 'Update Recipe' : 'Create Recipe'}</button>
            </section>
            )
          }
        </>
      )


}

export default ManageRecipe;
