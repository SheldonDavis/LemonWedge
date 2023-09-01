import http, { axiosPrivate } from '../api/http-common'

const MealplanDataService = {
    
    //write data to DB
    saveMealplan:async function(data){
        return axiosPrivate.post('/mealplan/create',data)
    },
    //get mealplan and attach recipes
    getMealPlan:async function(id, accessToken){
        //console.log('/mealplan/latest?user='+id)
        return axiosPrivate.get('/mealplan/latest?user='+id,
        {
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
    },
    toggleRecipeCookStatus: async function(data,accessToken){
        return axiosPrivate.patch(`/mealplan/toggle`, data,{
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
    },
    closeActiveMealplan: async function(data,accessToken){
        return axiosPrivate.patch(`/mealplan/close`, data,{
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
    }

}
export default MealplanDataService