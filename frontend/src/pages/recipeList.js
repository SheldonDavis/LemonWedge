import React, {useState, useEffect, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom' 

//components
import SkeletonRecipe from '../components/skeletons/SkeletonRecipe'
import SingleRecipe from '../components/singleRecipe'
import CreatingMealplan from '../components/creatingMealplan'

//hooks
import useAuth from '../hooks/useAuth'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'
import useInput from '../hooks/useInput'
import useRecipes from '../hooks/useRecipes'
import useArrayList from '../hooks/useArrayList'

//icons
import {faSearch, faEraser} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

//begin createing the recipe list page
const RecipeList = (props) => {
  //required to retrieve recipes
  const axiosPrivate = useAxiosPrivate()

  //get user access info
  const {auth} = useAuth()

  //searc form keywords
  const [keywords, resetKeywords, keywordsAttribs]= useInput('keywords','')
  const [pageNum, setPageNum] = useState(0)
  let {
    isLoading,
    isError,
    error,
    results,
    hasNextPage,
  } = useRecipes(pageNum, keywords)
  
  //set reference to searchbox
  const keywordsRef = useRef()
  //focus search box
  //disabled as it became annoying on mobile.
  // useEffect(()=>{
  //   if(auth.accessToken){//login token still valid
  //     keywordsRef.current.focus()
  //   }
  // },[])

  //add hook for accessing and using mealplan hook
  const {value,reset,addOrRemove} = useArrayList('mealplan',[])
  
  //intersection observer reference
  const intObserver = useRef()
  //when user scrolls close enough to the last recipe, load more...
  const lastRecipeRef = useCallback(recipe=>{
    if(isLoading) return
    if(intObserver.current) intObserver.current.disconnect()

    intObserver.current = new IntersectionObserver(recipes=>{
      if(recipes[0].isIntersecting && hasNextPage){
        // console.log('near the last recipe')
        setPageNum(prev=>prev+1)
      }
    })

    if(recipe) intObserver.current.observe(recipe)
  },[isLoading, hasNextPage])

  //reload data using keywords
  const handleFiltersSubmit = (e) => {
    e.preventDefault()
    setPageNum(-1)
  }

  // clear search box
  const handleClearForm = (e) => {
    resetKeywords('')
    setPageNum(0)
  }

  return(
    <>
    {
      auth.accessToken
      ?(
        <>
        {!isError
        //if no errors, build the recipe list and filter
        ?(
          <>
            <section className='RecipeFilters'>
              <form className='FilterForm'  onSubmit={(e)=>{handleFiltersSubmit(e)}}>
                <div className='recipeFiltersRow'>
                  <div className='input-group'>

                    <label htmlFor='RecipeTextInput'>Search for Keywords:</label>

                    <input 
                      type='text' 
                      placeholder='sandwich, chicken, grilled etc.' 
                      id='RecipeTextInput' 
                      className='clearOnReset' 
                      ref={keywordsRef}
                      {...keywordsAttribs}
                    />

                    <button type='submit' title='Search'><FontAwesomeIcon icon={faSearch} title='Search'/></button>

                    <button type='button' onClick={(e)=>{handleClearForm(e)}} title='Clear Filters'><FontAwesomeIcon icon={faEraser} title='Clear Filters'/></button>

                  </div>
                </div>                
                
                <div className='recipeFiltersRow'>
                    
                </div>

              </form>
            </section>
            <section className='recipesList'>
            
            {results.map((recipe, i)=>{
              if(results.length===i+1){
                // console.log('last element')
                return <SingleRecipe 
                  ref={lastRecipeRef} 
                  recipe={recipe}
                  key={recipe._id} 
                  addOrRemove={addOrRemove}
                  mealplan={value}
                />
              }

              return <SingleRecipe 
                recipe={recipe} 
                key={recipe._id} 
                addOrRemove={addOrRemove}
                mealplan={value}
              />
                
            })}
            </section>
            <CreatingMealplan mealplan={value} addOrRemove={addOrRemove} reset={reset}/>
            {isLoading ? //show skeleton while loading
              <div className='skeletonOuterWrapper'>
              {
                [...Array(5).keys()].map((i, key)=>{
                  return <SkeletonRecipe key={key}/>
                })
              }
              </div>
            :
            results.length===0 &&
              <>
                <p>No recipes found.</p>
              </>
            }
          </>

        )
        :(
          <p>There was an error retrieving recipes <br/> {error.message}</p>
        )}
          
        </>
      ):(
        <>
          <p>Login to view recipes</p>
          <Link to='/login'>Log in</Link>
        </>
      )
    }
    
    </>
  )
}

export default RecipeList;
