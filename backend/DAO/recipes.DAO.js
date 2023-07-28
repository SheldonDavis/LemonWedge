import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let recipes, recipeTags

export default class RecipeDAO{
    static async injectDB(conn){
        if(recipes && recipeTags){
            return
        }

        try{
            recipes = await conn.db(process.env.MONGODB_DB).collection('recipes')
            // recipes = await conn.db(process.env.MONGODB_DB_CLOUD).collection('recipes')
            recipeTags = await conn.db(process.env.MONGODB_DB).collection('mealCategoryTags')
            // recipeTags = await conn.db(process.env.MONGODB_DB_CLOUD).collection('mealCategoryTags')
        }catch(e){
            console.error(`Unable to extablish a collection in recipes.DAO: ${e}`)
        }
    }

    static async getRecipes({
        filters=null,
        page=0,
        recipesPerPage=20,
    }={}){
        let query
        if(filters){
            if('recipename' in filters){
                query = {$text: {$search: filters['recipename']}}
            }else if ('description' in filters){
                // query = {'description': {$text: filters['description']}}
                query = {$text: {$search: filters['description']}}
            }else if ('ingredients' in filters){
                // query = {'ingredients.name': {$text: filters['ingredients']}}
                query = {$text: {$search: filters['ingredients.name']}}
            }else if ('all' in filters){
                // query = {'ingredients.name': {$text: filters['ingredients']}}
                query = {$text: {$search: filters['all']}}
            }
        }
        let cursor

        try{
            cursor= await recipes
            .find(query)
        }catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {recipeList:[], totalNumRecipes:0}
        }
        const displayCursor = cursor.limit(recipesPerPage).skip(recipesPerPage * page)

        try{
            const recipesList = await displayCursor.toArray()
            const totalNumRecipes = await recipes.countDocuments(query)
            //return data as array (JSON)
            return {recipesList, totalNumRecipes}
        }catch(e){
            console.error(`Unable to convert cursor to array or problem countring documents, ${e}`)
            return {recipeList:[], totalNumRecipes: 0}
        }


    }

    static async addRecipe(recipename,description,ingredients,instructions,image64,imagename,createdBy, ispro, tags,){
        try{
            let date = new Date()
            let timestamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
            const recipeDoc = {
                recipename:recipename,
                description:description,
                ingredients:ingredients,
                instructions:instructions,
                image64:image64,
                imagename:imagename,
                createdBy:createdBy,
                createdAt:timestamp,
                updatedAt:timestamp,
                ispro:ispro,
                tags:tags,
                
            }
            return await recipes.insertOne(recipeDoc)
            
        }catch(e){
            console.error(`unable to post recipe: ${e}`)
            return {error: e}
        }
    }

    static async updateRecipe(recipeId,recipename,description,ingredients,instructions,image64,imagename,ispro, tags,){
        try{
            let date = new Date()
            let timestamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
            const updateResponse = await recipes.updateOne(
                {_id: new ObjectId(recipeId)},
                {$set: {
                    recipename, 
                    description,
                    ingredients,
                    instructions,
                    image64,
                    imagename,
                    updatedAt:timestamp,
                    ispro,
                    tags,
                }},
            )
            return updateResponse
            
        } catch(e){
            console.error(`unable to update recipe: ${e}`)
            return {error: e}
        }
    }

    static async deleteRecipe(recipeId){
        try{
            const deleteResponse = await recipes.deleteOne(
                {_id: new ObjectId(recipeId)},//look for this
            )
            return deleteResponse
            
        }catch(e){
            console.error(`unable to delete recipe: ${e}`)
            return {error: e}
        }
    }

    static async GetRecipeById(id){
        try{
            // const pipeline = [
            //     {
            //         $match: {
            //             _id: new ObjectId(id)
            //         }
            //     },
            //         {
            //             $loopup:{
            //                 from:'recipes',
            //                 let:{
            //                     id:'$_id',
            //                 },
            //                 pipeline:[
            //                     {
            //                         $match:{
            //                             $expr:{
            //                                 $eq,
            //                             },
            //                         },
            //                     },
            //                     {
            //                         $sort:{
            //                             date:-1,
            //                         },
            //                     },
            //                 ],
            //                 as:'reviews',
            //             },
            //         },
            //         {
            //             $addFields:{
            //                 reviews:'$reviews',
            //             },
            //         },
            // ]
            // return await recipes.aggregate(pipeline).next()
            return await recipes.findOne({'_id':new ObjectId(id)})

        }catch(e){
            console.error(`Something went wrong in GetRecipeById: ${e}`)
            throw e
        }
    }

    static async GetRecipeTags(){
        try{
            let tags = await recipeTags.find()
            const displayCursor = tags.limit(0).skip(0)
            const tagList = await displayCursor.toArray()
            return tagList
        }catch(e){
            console.error(`Something went wrong in GetRecipeTags: ${e}`)
            throw e
        }
    }
}