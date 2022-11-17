const Router = require('express')

const router = new Router()

const userController = require('../controllers/userController')

const auth = require('../mw/auth')

router.post('/auth', auth, userController.auth)
router.post('/refresh', userController.refresh)
// router.post('/authtest', userController.authtest)


module.exports = router