const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const profileController = require('../controllers/profileController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/setAvatar',auth,profileController.setAvatar)

router.post('/setName',[
    check('name','Минимальный размер имени 2 символа').isLength({min: 2}),
],auth,profileController.setName)

router.post('/setPassword',[
    check('newPassword','Минимальный размер пароля 7 символов').isLength({min: 7}),
],auth,profileController.setPassword)



module.exports = router