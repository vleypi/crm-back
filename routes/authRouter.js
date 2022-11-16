const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const authController = require('../controllers/authController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/registration',[
    check('email','Не соотвествует email параметрам').isEmail(),
    check('password','Минимальный размер пароля 7 символов').isLength({min: 7}),
    check('name','Что-то пошло не так').notEmpty(),
    check('surname','Что-то пошло не так').notEmpty(),
    check('phone','Что-то пошло не так').isLength({min: 11}),
    check('phone','Что-то пошло не так').isLength({max: 11}),
],authController.registration)

router.post('/login',[
    check('email','Что-то пошло не так').notEmpty(),
    check('password','Что-то пошло не так').notEmpty()
]
,authController.login)

router.post('/test',auth,role(['DELETE']),authController.test)
 
module.exports = router