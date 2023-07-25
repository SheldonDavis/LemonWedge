import UserDAO from "../../DAO/users.DAO.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class UserController{

    static async apiGetUsers(req, res, next){
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage,10):20
        const page = req.query.page ? parseInt(req.query.page, 10):0

        let filters ={}

        const {usersList, totalNumUsers} = await UserDAO.getUsers({
            filters,
            page,
            usersPerPage,
        })

        let response = {
            users: usersList,
            page: page,
            filters: filters,
            entries_per_page: usersPerPage,
            total_results:totalNumUsers,
        }
        res.json(response)
    }

    static async apiPostNewUser(req, res, next){
        const {user, pwd, email} = req.body
        if(!user || !pwd || !email) return res.status(400).json({'message': 'Email, Usernmame, and Password are required.'})

        //check for duplicate username in db
        const duplicateUser = await UserDAO.checkDupUsername(user)
        const duplicateEmail = await UserDAO.checkDupEmail(email)

        if(duplicateUser || duplicateEmail) return res.sendStatus(409)//send conflict status (username exists)

        try{
                //encrypt PW
            const hashedPwd = await bcrypt.hash(pwd, 10)

            const userResponse = await UserDAO.postNewUser( user, hashedPwd, email)

            res.status(201).json({status:'success'})
        }catch(e){
            res.status(500).json({'message':e.message})
        }

    }

    static async apiGetUserByToken(req,res,next){
        try{
            const cookies = req.cookies
            if(!cookies?.jwt) return res.sendStatus(401)

            const refreshToken = cookies.jwt

            let user = await UserDAO.GetUserByToken(refreshToken)
            if (!user){
                res.status(404).json({error:'User not found'})
                return
            }
            res.json(user)
        }catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error:e})
        }
    }

    static async apiGetUserById(req,res,next){
        try{
            let id = req.params.id || {}
            let user = await UserDAO.GetUserById(id)
            if (!user){
                res.status(404).json({error:'User not found'})
                return
            }
            res.json(user)
        }catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error:e})
        }
    }
    
    static async apiUpdateUser(req, res, next){        
        try{
            
            const {_id, username, email, firstName, lastName,likes,dislikes,allergies} = req.body
            // const pwd = req.body.pwd            
            // const hashedPwd = await bcrypt.hash(pwd, 10)
          
            const userResponse = await UserDAO.updateUser(
                _id,
                username,
                email,
                firstName,
                lastName,
                likes,
                dislikes,
                allergies,
            )
                
            let {error} = userResponse
            if(userResponse.error){
                res.status(400).json({error})
            }
            if(userResponse.modifiedCount === 0){
                throw new Error('unable to update user - some data does not match requirements or there is nothing to update')
            }
            res.json({ status: "success" })
            
        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiHandleRefreshToken(req,res){
        try{
            const cookies = req.cookies
            if(!cookies?.jwt) return res.sendStatus(401)

            const refreshToken = cookies.jwt

            const foundUser = await UserDAO.checkUserToken(refreshToken)

            if(!foundUser) return res.sendStatus(401)//unauthorized

            //evaluate JWT
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) =>{
                    if(err || foundUser.username !== decoded.username) return res.sendStatus(403)

                    const roles = Object.values(foundUser.roles)

                    const accessToken = jwt.sign(
                        {'UserInfo':{
                            'username':decoded.username,
                            'roles': roles,
                            '_id': foundUser._id,
                        }},
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn:'15m'}
                    )

                    // console.log(`${foundUser.username}'s access refreshed`)
                    // res.json({roles,accessToken})
                    res.json({accessToken})
                }
            )
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiHandleLogin(req,res,next){
        try{

            const {user, pwd} = req.body
        
            if(!user || !pwd) return res.status(400).json({'message': 'Username and password are required.'})
    
            const foundUser = await UserDAO.checkDupUsername(user)
            
            if(!foundUser) {
                //console.log('user not found')
                return res.sendStatus(401)//unauthorized
            }
    
            //evaluate PW
            const match = await bcrypt.compare(pwd, foundUser.pwd)
    
            if(match){

                const roles = Object.values(foundUser.roles).filter(Boolean)

                //create JWTs refresh and access
                const accessToken = jwt.sign(
                    {'UserInfo':{
                        'username':foundUser.username,
                        'roles': roles,
                        '_id': foundUser._id,
                    }},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:'15m'}
                )
                const refreshToken = jwt.sign(
                    {username:foundUser.username},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn:'1d'}
                )
    
                //send to tokens table?
                await UserDAO.updateUserToken(foundUser._id,refreshToken)
                //send success
                console.log(`User logged in. Hello, ${foundUser.username}`)
                res.cookie('jwt', refreshToken, {httpOnly:true, sameSite:'None', secure:true, maxAge:24*60*60*1000})
                // res.json({ roles, accessToken })
                res.json({ accessToken })
            }else{
                //console.log('no match')
                res.sendStatus(401);//unauthorized
            }
        }catch(e){
            res.status(500).json({error: e.message})
        }


    }

    static async apiHandleLogOut(req,res){
        try{//on client also delete access token

            const cookies = req.cookies
            if(!cookies?.jwt) {
                // console.log('no cookie || JWT present')
                return res.sendStatus(204)//no content to send back
            }
            
            const refreshToken = cookies.jwt

            //is refreshtoken in DB
            const foundUser = await UserDAO.checkUserToken(refreshToken)

            if(!foundUser) {
                // console.log(`no user found in DB : ${foundUser}`)
                res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true, })
                return res.sendStatus(204)//successful but no content
            }

            //delete refresh from db
            await UserDAO.userLogOut(foundUser.username, refreshToken)
            res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true, })//secure:true only on HTTPS environments
            
            console.log(`User has logged out. Goodbye, ${foundUser.username}.`)

            res.sendStatus(204)//success - no content
            
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiHandleCheckDups(req,res){
        const {username, email} = req.body
        // //check for duplicate username in db
        let duplicateUser, duplicateEmail = false       

        if(username) duplicateUser = await UserDAO.checkDupUsername(username)
        
        if(email) duplicateEmail = await UserDAO.checkDupEmail(email)

        //if dip exists, send 409
        if(duplicateUser || duplicateEmail) return res.sendStatus(409)

        //success, no dup exist
        res.sendStatus(200)
    }
    
}