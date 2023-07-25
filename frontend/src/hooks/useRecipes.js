import {useState, useEffect} from 'react'

//services
import RecipeDataService from '../services/recipe.serv'

const useRecipes = (pageNum=0,keywords='') => {

    const [results,setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false)

    useEffect(()=>{
        if(pageNum<0)pageNum=0//overwrite pageNum for filter refresh of data
        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller = new  AbortController()
        const {signal} = controller
        RecipeDataService.getAll(pageNum,5,keywords,{signal})
        .then(data=>{
            let recipes = data.data.recipes
           if(pageNum===0){
            //overwrite existing recipeslist and show only updated recipeslist
            setResults(prev=>[...recipes])
           }else{
            //append new recipeslist to old recipeslist
            setResults(prev=>[...prev, ...recipes])
           }
            
            setHasNextPage(Boolean(recipes.length))
            setIsLoading(false)
        })
        .catch(e=>{
            setIsLoading(false)
            if(signal.aborted) return
            setIsError(true)
            setError({message:e.message})
        })
        return()=> controller.abort()
    },[pageNum])

    return { isLoading, isError, error, results, hasNextPage }

    // await RecipeDataService.getAll(page,recipesPerPage)
    //   .then((res)=>{
    //     setPages(Math.ceil((res.data.total_results/res.data.entries_per_page)))
    //     setRecipes(res.data.recipes)
    //   })
    //   .catch((e)=>{
    //     //console.error(e)
    //   })


}
export default useRecipes