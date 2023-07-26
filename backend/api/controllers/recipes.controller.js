import RecipeDAO from "../../DAO/recipes.DAO.js";

export default class RecipeController{
    static async apiGetRecipes(req, res, next){
        const recipesPerPage = req.query.recipesPerPage ? parseInt(req.query.recipesPerPage,10):20
        const page = req.query.page ? parseInt(req.query.page, 10):0

        let filters ={}
        if(req.query.description){
            filters.description = req.query.description
        }else if(req.query.ingredients){
            filters.ingredients = req.query.ingredients
        }else if(req.query.recipename){
            filters.recipename = req.query.recipename
        }else if(req.query.all){
            filters.all = req.query.all
        }
        const {recipesList, totalNumRecipes} = await RecipeDAO.getRecipes({
            filters,
            page,
            recipesPerPage,
        })

        let response = {
            recipes: recipesList,
            page: page,
            filters: filters,
            entries_per_page: recipesPerPage,
            total_results:totalNumRecipes,
        }
        res.json(response)
    }

    static async apiPostRecipe(req, res, next){
        try{
            const recipename = req.body.recipename
            const description = req.body.description
            const ingredients = req.body.ingredients
            const instructions = req.body.instructions
            const image64 = req.body.image64
            const imagename = req.body.imagename
            const createdBy = req.body.createdBy
            const ispro = req.body.ispro
            

            const recipeResponse = await RecipeDAO.addRecipe(
                recipename,
                description,
                ingredients,
                instructions,
                image64,
                imagename,
                createdBy,
                ispro,
            )
            res.json({status:'success'})
        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateRecipe(req, res, next){  
        try{
            const recipeId = req.body.recipe_id
            const recipename = req.body.recipename
            const description = req.body.description
            const ingredients = req.body.ingredients
            const instructions = req.body.instructions
            const image64 = req.body.image64
            const imagename = req.body.imagename
            const createdBy = req.body.createdBy
            const ispro = req.body.ispro
            
            //check if submittor is author
            const checkRecipeCreatedBy = await RecipeDAO.GetRecipeById(recipeId)
            if(createdBy !== checkRecipeCreatedBy.createdBy){   
                throw new Error('unable to update recipe - submittor is not the recipe author')
            }

            const recipeResponse = await RecipeDAO.updateRecipe(
                recipeId,
                recipename,
                description,
                ingredients,
                instructions,
                image64,
                imagename,
                ispro,
            )
                
            let {error} = recipeResponse
            if(recipeResponse.error){
                res.status(400).json({error})
            }
            if(recipeResponse.modifiedCount === 0){
                throw new Error('unable to update recipe - some data does not match requirements or there is nothing to update')

            }
            res.json({ status: "success" })
            
        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiDeleteRecipe(req, res, next){
        try {
            const recipeId = req.query._id
            console.log(`deleting recipe: #${recipeId}`)

            const recipeResponse = await RecipeDAO.deleteRecipe(recipeId,)

            res.json({status:'success'})
        } catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiGetRecipeById(req,res,next){
        try{
            let id = req.params.id || {}
            let recipe = await RecipeDAO.GetRecipeById(id)
            if (!recipe){
                res.status(404).json({error:'Recipe not found'})
                return
            }
            res.json(recipe)
        }catch(e){
            console.error(`api, ${e}`)
            res.status(500).json({error:e})
        }
    }

    static async apiGetRecipeTags(req,res,next){
        try{
            let tags = await RecipeDAO.GetRecipeTags()
            res.json(tags)
        }catch(e){
            console.error(`api, ${e}`)
            res.status(500).json({error:e})
        }
    }
}