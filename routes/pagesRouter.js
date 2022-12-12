const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const pagesController = require('../controllers/pagesController')

const auth02 = require('../mw/auth02')
const role = require('../mw/role')

router.get('/getBlog',pagesController.getBlog)
router.get('/getPost',pagesController.getPost)

router.get('/getProfile',auth02,role(['Владелец','Педагог','Ученик']),pagesController.getProfile)
router.get('/getEditor',auth02,role(['Владелец']),pagesController.getEditor)
// router.get('/getPosts',pagesController.getPosts)
router.get('/getRole',auth02,pagesController.getRole)
router.get('/getStudents',auth02,role(['Владелец','Педагог']),pagesController.getStudents)
router.get('/getSchedule',auth02,role(['Владелец','Педагог','Ученик']),pagesController.getSchedule)
router.get('/getLessons',auth02,role(['Владелец','Педагог']),pagesController.getLessons)
router.get('/getStatuses',auth02,role(['Владелец']),pagesController.getStatuses)
router.get('/getTeachers',auth02,role(['Владелец']),pagesController.getTeachers)
router.get('/getVisits',auth02,pagesController.getVisits)

router.get('/getChats',auth02,pagesController.getChats)
router.get('/getUsersForChat',auth02,pagesController.getUsersForChat)
//[chat_id]

router.get('/getChat',auth02,pagesController.getChat)

//[user_id]
router.get('/getStudent/lessons',role(['Владелец','Педагог']),auth02,pagesController.getStudentLessons)
router.get('/getStudent/schedule',role(['Владелец','Педагог']),auth02,pagesController.getStudentSchedule)

router.get('/getTeacher/lessons',role(['Владелец']),auth02,pagesController.getTeacherLessons)
router.get('/getTeacher/schedule',role(['Владелец']),auth02,pagesController.getTeacherSchedule)

//[lesson_id]
router.get('/getLesson/participants',role(['Владелец','Педагог']),auth02,pagesController.getLessonParticipants)


module.exports = router