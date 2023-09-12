import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let users
export default class UserDAO{
    static async injectDB(conn){
        if(users){
            return
        }

        try{
            users=await conn.db(process.env.MONGODB_DB).collection('users')
            // users=await conn.db(process.env.MONGODB_DB_CLOUD).collection('users')
        }catch(e){
            console.error(`Unable to establish a collection in users.DAO: ${e}`)
        }
    }
    
    static async getUsers({
        filters=null,
        page=0,
        resultsPerPage = 20,
    }={}){
        let query
        
        let cursor

        try{
            cursor= await users
            .find(query)
        }catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {usersList:[], totalNumUsers:0}
        }

        const displayCursor = cursor.limit(resultsPerPage).skip(resultsPerPage * page)

        try{
            const usersList = await displayCursor.toArray()
            const totalNumUsers = await users.countDocuments(query)
            //return data as array (JSON)
            return {usersList, totalNumUsers}
        }catch(e){
            console.error(`Unable to convert cursor to array or problem countring documents, ${e}`)
            return {usersList:[], totalNumUsers: 0}
        }


    }

    static async postNewUser(user, pwd, email){
        try{
            
            let dateOptions = {hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false,}
            let date = new Date().toLocaleDateString("en-CA", dateOptions)
            const userDoc = {
                username:user,
                pwd:pwd,
                email: email,
                roles:{'User':2001},
                createdAt:date,
                updatedAt:date,
            }
            return await users.insertOne(userDoc)

        }catch(e){
            console.error(`unable to post user ${e}`)
            return {error: e}
        }
    }
    
    static async GetUserById(id){
        try{
            return await users.findOne({'_id':new ObjectId(id)})

        }catch(e){
            console.error(`Something went wong in GetUserByID: ${e}`)
            throw e
        }
    }

    static async GetUserByToken(refreshToken){
        try{
            return await users.findOne({refreshToken},{projection:{pwd:0,refreshToken:0,roles:0,}})
        }catch(e){
            console.error(`Something went wrong with GetUserByToken: ${e}`)
            throw e
        }
    }

    static async updateUser(_id,
        username,
        email,
        firstName,
        lastName,
        likes,
        dislikes,
        allergies,){
        try{
            
            let dateOptions = {hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false,}
            let date = new Date().toLocaleDateString("en-CA", dateOptions)          
            const updateResponse = await users.updateOne(
                {_id: new ObjectId(_id)},
                {$set: {
                    username:username, 
                    email:email,
                    firstName:firstName,
                    lastName:lastName,
                    likes:likes,
                    dislikes:dislikes,
                    allergies:allergies,
                    updatedAt:date,
                }},
            )
            return updateResponse
            
        } catch(e){
            console.error(`unable to update user: ${e}`)
            return {error: e}
        }
    }

    
    static async updateUserPW(_id,
        hashedPwd){
        try{
            
            let dateOptions = {hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false,}
            let date = new Date().toLocaleDateString("en-CA", dateOptions)          
            const updateResponse = await users.updateOne(
                {_id: new ObjectId(_id)},
                {$set: {
                    pwd:hashedPwd,
                }},
            )
            return updateResponse
            
        } catch(e){
            console.error(`unable to update user: ${e}`)
            return {error: e}
        }
    }

    static async checkDupUsername_forLogin(username){
        try{
            return await users.findOne({username},{projection:{username:1,pwd:1,roles:1,_id:1,}})
        }catch(e){
            console.error(`Something went wrong in CheckDupUsername: ${e}`)
            throw e
        }
    }
    
    static async checkDupEmail(email){
        try{
            return await users.findOne({email},{projection:{email:1,_id:0}})
        }catch(e){
            console.error(`Something went wrong in CheckDupEmail: ${e}`)
            throw e
        }
    }

    static async checkDupUsername(username){
        try{
            return await users.findOne({username},{projection:{username:1,_id:0}})
        }catch(e){
            console.error(`Something went wrong in checkDupUsername: ${e}`)
            throw e
        }
    }

    static async checkUserToken(refreshToken){
            try{
                return await users.findOne({refreshToken})
            }catch(e){
                console.error(`Something went wrong in checkUserToken: ${e}`)
                throw e
            }
    }

    static async userLogOut(username, refreshToken){
        try{
            const deleteResponse = await users.updateOne(
                {username, refreshToken},                
                {$set: {refreshToken:''}},
            )
            return deleteResponse
            
        }catch(e){
            console.error(`unable to remove user token: ${e}`)
            return {error: e}
        }
    }

    static async updateUserToken(userId,refreshToken,){
        try{
            const updateResponse = await users.updateOne(
                {_id: new ObjectId(userId)},
                {$set: {refreshToken,}},
            )
            return updateResponse
            
        } catch(e){
            console.error(`unable to update user token: ${e}`)
            return {error: e}
        }
    }
}