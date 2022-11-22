const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const blogController = require('../controllers/blogController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/publishPost',auth,[check('header','Нет заголовка').notEmpty(),],blogController.publishPost)
 
module.exports = router