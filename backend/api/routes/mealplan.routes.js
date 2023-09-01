import express from 'express'
import MealplanCtrlr from '../controllers/mealplan.controller.js'

//middleware
import verifyJWT from '../../middleware/verifyJWT.MW.js'
import verifyRoles from '../../middleware/verifyRoles.MW.js'


//config
import ROLES_LIST from '../../config/rolesList.js'

const router = express.Router()

//create new mealplan
router.route('/create').post(verifyJWT, verifyRoles(ROLES_LIST.User), MealplanCtrlr.apiPostNewMealplan)
// router.route('/create').post(MealplanCtrlr.apiPostNewMealplan)

//get all recipes data passing mealplan id in query
router.route('/latest').get(verifyJWT, verifyRoles(ROLES_LIST.User), MealplanCtrlr.apiGetMealPlanData)

//mark a recipe in a mealplan as cooked/uncooked
router.route('/toggle').patch(verifyJWT, verifyRoles(ROLES_LIST.User), MealplanCtrlr.apiPatchRecipeCookStatus)

//mark a mealplan as completed
router.route('/close').patch(verifyJWT, verifyRoles(ROLES_LIST.User), MealplanCtrlr.apiPatchCloseMealplan)

export default router