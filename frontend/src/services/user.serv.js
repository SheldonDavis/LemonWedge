import http, {axiosPrivate} from '../api/http-common'

const UserDataService={
    
    getAll:function(page=0,signal){
        return axiosPrivate.get(`/users/?page=${page}`,{
            signal:signal
        })
    },

    //get by id
    get:function(id){
        return http.get(`/users/id/${id}`)
    },

    //get by token
    getMe:function(token){
        // console.log(token)
        return http.get(`/users/me`,
        {
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        
    
    },

    find(query, by ='name', page=0){
        // return axiosPrivate.get(`/users?${by}=${query}&page=${page}`)
        return axiosPrivate.get(`/users?${by}=${query}&page=${page}`)
    },

    //create
    createUser:function(data){
        return http.post(
            'users/manage',//account create api url URL
            data,
            {
                withCredentials:true,
            }
        )
    },

    //update
    updateUser:function(data, token){
        return http.patch(
            '/users/manage',
            data,
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
    },

    //log in in the user
    loginUser:function(data){
        return http.post(
            'users/auth',
            data,
            {
                withCredentials:true,
            }
        )
    },

    refreshToken:function(token,signal){
        return http.get(
            'users/refresh',
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                },
                signal:signal
            }
        )
    },

    logOutUser:function(){
        return http('users/logout',{
            withCredentials:true
        })
    },
    
    checkDups:function(data){
        return http.post(
            'users/dups',//account create api url URL
            data,
        )
    },

    updatePassword:function(data, token){
        return http.patch(
            '/users/manage/PW',
            data,
            {
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
    }

}

export default UserDataService