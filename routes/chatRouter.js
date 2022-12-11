const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const chatController = require('../controllers/chatController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/createChat',auth,chatController.createChat)
router.post('/saveChat',auth,chatController.saveChat)

module.exports = router