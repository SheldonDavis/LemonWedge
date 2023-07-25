import express from 'express'

//controller
import MailCtrlr from '../controllers/mail.controller.js'

const router = express.Router()

router.route('/welcome').post(MailCtrlr.apiPostSendWelcome)
router.route('/acctUpdate').post(MailCtrlr.apiPostSendAccountUpdate)

export default router