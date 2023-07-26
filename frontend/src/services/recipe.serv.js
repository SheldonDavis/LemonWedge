import http, { axiosPrivate } from '../api/http-common'

const RecipeDataService = {

    //retrieve all recipes, paged, and 
    getAll: async function(page=0,recipesPerPage=20,keywords=null){
        if(keywords){
            return await axiosPrivate.get(`/recipes?page=${page}&recipesPerPage=${recipesPerPage}&all=${keywords}`)
        }
        return await axiosPrivate.get(`/recipes?page=${page}&recipesPerPage=${recipesPerPage}`)
    },

    //filter by search term accross recipe name, description, and ingredients
    find: function(query, by ='name', page=0){
        return axiosPrivate.get(`/recipes?${by}=${query}&page=${page}`)
    },

    //get specific recipe by id
    get: function(id){
        return axiosPrivate.get(`/recipes/id/${id}`)
    },

    //create recipe from data
    createRecipe:function(data){
        return axiosPrivate.post('/recipes',data)
    },

    //update recipe information
    updateRecipe:function(data){
        // console.log(`UPDATE WITH DATA = ${data}`)
        return axiosPrivate.patch('/recipes',data)
    },

    //delete a recipe
    //currently unused
    deleteRecipe:function(id){
        return axiosPrivate.delete(`/recipes?_id=${id}`)
    },

    //retrieve recipe tags
    getTags:function(accessToken){
        return axiosPrivate.get(`/recipes/tags`,
        {
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
    },

}

export default RecipeDataService