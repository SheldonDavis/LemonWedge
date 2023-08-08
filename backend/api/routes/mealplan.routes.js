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
router.route('/latest').get(MealplanCtrlr.apiGetMealPlanData)

export default router