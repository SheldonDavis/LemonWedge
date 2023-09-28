import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let mealplan

export default class MealplanDAO{
    static async injectDB(conn){
        if(mealplan){
            return
        }

        try{
            mealplan=await conn.db(process.env.MONGODB_DB).collection('mealplans')
            // users=await conn.db(process.env.MONGODB_DB_CLOUD).collection('users')
        }catch(e){
            console.error(`Unable to establish a collection in mealplan.DAO: ${e}`)
        }
    }

    static async PostNewMealplan(user,meals,isComplete,){
        try{
            
            let dateOptions = {hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false,}
            let date = new Date().toLocaleDateString("en-CA", dateOptions)

            const mealplanDoc = {
                user:user,
                mealplan:meals,
                createdAt:date,
                isComplete:isComplete,

            }
            
            return await mealplan.insertOne(mealplanDoc)
           
        }catch(e){
            console.error(`unable to post mealplan: ${e}`)
            return {error: e}
        }
    }

    static async getMealPlanData(user){
        try{
            let id = user

            let query = [
                {
                  $match:
                    {
                      user: id,
                      isComplete: false,
                    },
                },
                {
                  $unwind:
                    {
                      path: "$mealplan",
                    },
                },
                {
                  $addFields:
                    {
                      recipeID: {
                        $toObjectId: "$mealplan._id",
                      },
                    },
                },
                {
                  $lookup:
                    {
                      from: "recipes",
                      let: {
                        ids: "$recipeID",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ["$_id", "$$ids"],
                            },
                          },
                        },
                      ],
                      as: "mealplan.recipe",
                    },
                },
                {
                  $group:
                    {
                      _id: "$_id",
                      mealplan: {
                        $push: {
                          _id: "$mealplan._id",
                          isCooked: "$mealplan.isCooked",
                          recipe: "$mealplan.recipe",
                        },
                      },
                    },
                },
              ]
            let cursor = ''
            
            try{
                cursor = await mealplan.aggregate(query)
                // cursor = await mealplan.find({'_id':new ObjectId(id)})
            }catch(e){
                console.error(`Unable to issue find command, ${e}`)
                return {recipeList:[]}
            }
            
            try{
                const recipesList = await cursor.toArray()
                // const totalNumRecipes = await recipes.countDocuments(query)
                //return data as array (JSON)
                return {recipesList}
            }catch(e){
                console.error(`Unable to convert cursor to array or problem countring documents, ${e}`)
                return {recipeList:[]}
            }
        }catch(e){
            console.error(`unable to post mealplan: ${e}`)
            return {error: e}
        }
    }

    static async patchRecipeCookStatus(mID, rID, val){
        try{
            return await mealplan.updateOne(
                {_id:new ObjectId(mID),"mealplan._id":rID},
                {$set:{"mealplan.$.isCooked":val}}
            )
        }catch(e){
            console.error(`unable to update recipe cooked status: ${e}`)
            return {error: e}
        }
    }


    static async patchMealplanClose(mID){
      try{
        return await mealplan.updateOne(
            {_id:new ObjectId(mID)},
            {$set:{"isComplete":true}}
        )
      }catch(e){
        console.error(`unable to set mealplan to closed status: ${e} `)
      }
    }

}