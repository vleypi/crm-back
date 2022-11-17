const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const lessonsController = require('../controllers/lessonsController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/getLessons',lessonsController.getLessons)
 
module.exports = router