import express from 'express'
import UserCtrlr from '../controllers/users.controller.js'

import verifyJWT from '../../middleware/verifyJWT.MW.js'
import ROLES_LIST from '../../config/rolesList.js'
import verifyRoles from '../../middleware/verifyRoles.MW.js'


    //create router
    const router = express.Router()

    router  
        .route('/')
            //get all user, only accessible to admin
            // .get(UserCtrlr.apiGetUsers)
            .get(verifyJWT, verifyRoles(ROLES_LIST.Admin), UserCtrlr.apiGetUsers)

    router  
        .route('/me')
            //get user information for currently logged in user
            .get(verifyJWT, verifyRoles(ROLES_LIST.User), UserCtrlr.apiGetUserByToken)
    
    router
        .route('/id/:id')
            //verifyJWT = if (user is logged in with a valid accessToken)
            //verifyRoles([roles to pass]) = if ( current logged in user has specific permissions)
            //get specific user by their user id
            .get(verifyJWT, verifyRoles(ROLES_LIST.Admin), UserCtrlr.apiGetUserById)        
            
    router
        //only used for managing user data...
        .route('/manage')
            //create new user
            .post(UserCtrlr.apiPostNewUser)
            //update user information
            //will check to make sure user can only edit information about THEIR account
            .patch(verifyJWT, verifyRoles(ROLES_LIST.User), UserCtrlr.apiUpdateUser)
            //only admin can delete users
            //disabled, unwrtten, unsure if needed
            // .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin),UserCtrlr.apiDeleteRecipe)//inactive

    router
        //for updating userPW
        .route('/manage/PW')        
        .patch(verifyJWT, verifyRoles(ROLES_LIST.User), UserCtrlr.apiUpdateUserPW)

    //for logging in a user and checking their credentials
    router
        .route('/auth')
            //pass user credentials, give access and refresh tokens where applicable
            .post(UserCtrlr.apiHandleLogin)

    //refresh the user token
    router.route('/refresh').get(UserCtrlr.apiHandleRefreshToken)

    //log user out, delete refresh token from DB
    router.route('/logout').get(UserCtrlr.apiHandleLogOut)

    //route for checking dups
    router.route('/dups').post(UserCtrlr.apiHandleCheckDups)

export default router