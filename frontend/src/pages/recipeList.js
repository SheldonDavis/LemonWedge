import React, {useState, useEffect, useRef, useCallback} from 'react'
import {Link} from 'react-router-dom' 

//components
import SkeletonRecipe from '../components/skeletons/SkeletonRecipe'
import SingleRecipe from '../components/singleRecipe'

//hooks
import useAuth from '../hooks/useAuth'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'
import useInput from '../hooks/useInput'
import useRecipes from '../hooks/useRecipes'

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
  useEffect(()=>{
    if(auth.accessToken){//login token still valid
      keywordsRef.current.focus()
    }
  },[])

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
                    <button type='submit' 
                    >Search</button>
                  </div>
                </div>                
                <div className='recipeFiltersRow'>
                  <button type='button' onClick={(e)=>{handleClearForm(e)}}>Clear Filters</button>
                </div>
              </form>
            </section>
            <section className='recipesList'>
            {results.map((recipe, i, key)=>{
              if(results.length===i+1){
                // console.log('last element')
                return <SingleRecipe ref={lastRecipeRef} recipe={recipe} key={recipe._id}/>
              }

              return <SingleRecipe recipe={recipe} key={recipe._id}/>
                
            })}
            </section>
            {isLoading && //show skeleton while loading
              [...Array(5).keys()].map((i, key)=>{
                return <SkeletonRecipe key={key}/>
              })
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
  // return (
  //   <>
  //     {auth.accessToken
  //     ?(
  //       <>
  //       {
  //         isLoading 
  //         ? (
  //           [...Array(20).keys()].map((i, key)=>{
  //             return <SkeletonRecipe key={key}/>
  //           })
  //         ):(
  //           <>
  //             <section className='RecipeFilters'>
  //               <form className='FilterForm'  onSubmit={handleFiltersSubmit}>
  //                 <div className='recipeFiltersRow'>
  //                   <div className='input-group'>
  //                     <label htmlFor='RecipeTextInput'>Search for Keywords:</label>
  //                     <input 
  //                       type='text' 
  //                       placeholder='sandwich, chicken, grilled etc.' 
  //                       id='RecipeTextInput' 
  //                       className='clearOnReset' 
  //                       {...keywordsAttribs}
  //                     />
  //                     <button type='submit' 
  //                     >Search</button>
  //                   </div>
  //                 </div>
  //                 <div className='recipeFiltersRow'>
  //                   <div className='input-group'>
  //                     <label htmlFor='resultsPerPage'>
  //                       Recipes per page: 
  //                     </label>
  //                     <select
  //                       id='resultsPerPage'
  //                       onChange={(e)=>{setRecipesPerPage(e.target.value)}}
  //                       value={recipesPerPage}
  //                     >
  //                       <option value='-1'>All</option>
  //                       <option value='20'>20</option>
  //                       <option value='10'>10</option>
  //                       <option value='5'>5</option>
  //                     </select>
  //                   </div>
  //                 </div>
                
  //                 <div className='recipeFiltersRow'>
  //                   <button type='button' onClick={()=>{handleClearForm()}}>Clear Filters</button>
  //                 </div>
  //               </form>
  //             </section>
  //             {recipes?.length
  //               ?(
  //                 <section className='allRecipes'>
  //                   {
  //                     recipes.map((recipe,i) =>{
  //                       if(recipes.length===i+1){
  //                         console.log(`last element = ${recipe.recipename}`)
  //                         return <SingleRecipe recipe={recipe} key={recipe._id} ref={lastRecipeRef}/>
  //                       }
  //                       return <SingleRecipe recipe={recipe} key={recipe._id}/>
                        
  //                     }

  //                     )
  //                   }
  //                   {
  //                     pages>1 
  //                     ?(
  //                       <div className='Pager'>
  //                         <button 
  //                           type='button' 
  //                           onClick={canPagePrev ? handleShowPreviousPage : (e)=>{}} 
  //                           disabled={canPagePrev ? false : true}
  //                         >
  //                           &lt;&lt;
  //                         </button>
  //                         {
  //                           [...Array(pages)].map((it, index) => {
  //                             return  <button 
  //                                       key={index} 
  //                                       type='button' 
  //                                       className={currentPage===index?'currentPage': ''} 
  //                                       onClick={(e)=>handleShowSpecificPage(index)}
  //                                     >
  //                                       {index+1}
  //                                     </button>
  //                           })
  //                         }
  //                         <button 
  //                           type='button' 
  //                           onClick={handleShowNextPage} 
  //                           disabled={canPageNext ? false : true}
  //                         >
  //                           &gt;&gt;
  //                         </button>
                          
  //                       </div>
  //                     )
  //                     :(<></>)
  //                   }
  //                 </section>
  //               ):(
  //                 <p>No recipes to display.</p>
  //               )

  //             }  
  //           </>
  //         )}
  //       </>
  //     ):(
  //       <>
  //         <p>Login to view recipes</p>
  //         <Link to='/login'>Log in</Link>
  //       </>
  //     )}
      
  //   </>
  // );
}

export default RecipeList;
