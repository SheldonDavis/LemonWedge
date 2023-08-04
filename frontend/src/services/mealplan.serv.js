import http, { axiosPrivate } from '../api/http-common'

const MealplanDataService = {
    
    //write data to DB
    saveMealplan:async function(data){
        return axiosPrivate.post('/mealplan/create',data)
    }

}
export default MealplanDataService