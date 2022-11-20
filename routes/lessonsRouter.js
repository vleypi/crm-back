const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const lessonsController = require('../controllers/lessonsController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/setLessons',auth,lessonsController.setLessons)
router.post('/getStudentsTeachers',auth,lessonsController.getStudentsTeachers)
 
module.exports = router