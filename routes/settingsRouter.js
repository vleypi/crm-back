const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const settingsController = require('../controllers/settingsController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/changePassword',[
    check('newPassword','Минимальный размер пароля 7 символов').isLength({min: 7}),
    check('password','Что-то пошло не так').notEmpty(),
],auth,settingsController.changePassword)

router.post('/changePassword',[
    check('newPassword','Минимальный размер пароля 7 символов').isLength({min: 7}),
    check('password','Что-то пошло не так').notEmpty(),
],auth,settingsController.changePassword)

router.post('/changeMainData',auth,settingsController.changeMainData)

router.get('/getAccesses',auth,settingsController.getAccesses)

router.post('/changeAccesses',auth,settingsController.changeAccesses)

router.get('/getRoles',auth,settingsController.getRoles)

router.post('/deleteRoles',auth,settingsController.deleteRoles)

router.get('/getStatuses',auth,settingsController.getStatuses)

router.post('/addStatuses',auth,settingsController.addStatuses)

router.post('/changeStatuses',auth,settingsController.changeStatuses)

// router.post('/addRoles',auth,settingsController.addRoles)




// router.post('/test',auth,role(['DELETE']),authController.test)
 
module.exports = router