import express from 'express'
import RecipeCtrlr from '../controllers/recipes.controller.js'

//middleware
import verifyJWT from '../../middleware/verifyJWT.MW.js'
import verifyRoles from '../../middleware/verifyRoles.MW.js'


//config
import ROLES_LIST from '../../config/rolesList.js'

//create router
const router = express.Router()

router
    .route("/")
        //create new recipe
        //available only to admin and editors permissions
        .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), RecipeCtrlr.apiPostRecipe)       //C - create
        //get all recipes
        //available to all
        .get(verifyJWT, verifyRoles(ROLES_LIST.User), RecipeCtrlr.apiGetRecipes)                            //R - read
        //update specific recipes
        //admin and editors only
        .patch(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), RecipeCtrlr.apiUpdateRecipe)    //U - update
        //delete a recipe
        //ADMIN ONLY
        .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), RecipeCtrlr.apiDeleteRecipe)                      //D - delete


//get specific recipe 
//accessible to all
router.route('/id/:id').get(verifyJWT, verifyRoles(ROLES_LIST.User), RecipeCtrlr.apiGetRecipeById)//get specific recipe by id

//get recipe tags
router.route('/tags').get(verifyJWT, verifyRoles(ROLES_LIST.User), RecipeCtrlr.apiGetRecipeTags)

export default router