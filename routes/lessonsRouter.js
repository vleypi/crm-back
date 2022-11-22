const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const lessonsController = require('../controllers/lessonsController')

const auth = require('../mw/auth')
const role = require('../mw/role')

router.post('/setLessons',auth,[
    check('lesson_type','Что-то пошло не так').notEmpty(),
    check('lesson_name','Минимальная длина названия 1 символ').isLength({min: 1}),
    check('lesson_color','Что-то пошло не так').notEmpty()
],lessonsController.setLessons)


router.post('/getStudentsTeachers',auth,lessonsController.getStudentsTeachers)
 
module.exports = router