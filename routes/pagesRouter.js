const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const pagesController = require('../controllers/pagesController')

const auth02 = require('../mw/auth02')
const role = require('../mw/role')

router.get('/getStudents',auth02,role(['Владелец','Педагог']),pagesController.getStudents)
router.get('/getLessons',auth02,role(['Владелец']),pagesController.getLessons)
router.get('/getStatuses',auth02,role(['Владелец','Педагог']),pagesController.getStatuses)

 
module.exports = router