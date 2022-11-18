const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const pagesController = require('../controllers/pagesController')

const auth02 = require('../mw/auth02')
const role = require('../mw/role')

router.get('/getStudents',auth02,role(['Владелец']),pagesController.getStudents)
 
module.exports = router