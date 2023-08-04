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


}