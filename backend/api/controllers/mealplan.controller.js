import MealplanDAO from '../../DAO/mealplan.DAO.js'

export default class MealplanController{

    static async apiPostNewMealplan(req,res,next){
        try{
            const user = req.body.user
            const mealplan = req.body.mealplan
            const isComplete = req.body.isComplete

            const mealplanResponse = await MealplanDAO.PostNewMealplan(
                user,
                mealplan,
                isComplete,
            )            
            res.json({status:'success'})
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiGetMealPlanData(req,res,next){
        try{
            const user = req.query.user

            const {recipesList} = await MealplanDAO.getMealPlanData(user)
                
            let response = {
                recipes: recipesList,
            }
            res.json(response)


        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiPatchRecipeCookStatus(req,res,next){
        try{
            
            const mID = req.body.mealplanID
            const rID = req.body.recipeID
            const val = req.body.val

            const mealplanResponse = await MealplanDAO.patchRecipeCookStatus(
                mID,
                rID,
                val,
            )            
            res.json({status:'success'})
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiPatchCloseMealplan(req,res,next){
        try{        
            
            const mID = req.body.mealplanID
            
            const mealplanCloseResponse = await MealplanDAO.patchMealplanClose(mID)   

            res.json({status:'success'})

        }catch(e){
            res.status(500).json({error: e.message})
        }
    }


}