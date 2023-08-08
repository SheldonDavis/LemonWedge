import http, { axiosPrivate } from '../api/http-common'

const MealplanDataService = {
    
    //write data to DB
    saveMealplan:async function(data){
        return axiosPrivate.post('/mealplan/create',data)
    },
    //get mealplan and attach recipes
    getMealPlan:async function(id){
        return axiosPrivate.post('/mealplan/latest?user='+id)
    }

}
export default MealplanDataService