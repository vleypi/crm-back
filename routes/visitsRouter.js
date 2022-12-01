const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const visitsController = require('../controllers/visitsController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/setVisitStatus', visitsController.setVisitStatus)

module.exports = router