const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const authController = require('../controllers/authController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/setUser',[
    check('email','Не соотвествует email параметрам').isEmail(),
    check('name','Что-то пошло не так').notEmpty(),
    check('gender','Что-то пошло не так').notEmpty(),
    check('phone','Что-то пошло не так').isLength({min: 11}),
    check('phone','Что-то пошло не так').isLength({max: 11}),
],authController.setUser)

router.post('/login',authController.login)

router.post('/logout',auth,authController.logout)

 
module.exports = router