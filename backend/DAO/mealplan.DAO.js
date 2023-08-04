import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let mealplan

export default class MealplanDAO{
    static async injectDB(conn){
        if(mealplan){
            return
        }

        try{
            mealplan=await conn.db(process.env.MONGODB_DB).collection('meaplans')
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

}