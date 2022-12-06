const Router = require('express')

const router = new Router()

const {check} = require('express-validator')

const pagesController = require('../controllers/pagesController')

const auth02 = require('../mw/auth02')
const role = require('../mw/role')

router.get('/getStudents',auth02,role(['Владелец','Педагог']),pagesController.getStudents)
router.get('/getLessons',auth02,role(['Владелец']),pagesController.getLessons)
router.get('/getStatuses',auth02,role(['Владелец','Педагог']),pagesController.getStatuses)
router.get('/getTeachers',auth02,role(['Владелец']),pagesController.getTeachers)
router.get('/getSchedule',auth02,role(['Владелец','Педагог']),pagesController.getSchedule)
router.get('/getVisits',auth02,pagesController.getVisits)

//[user_id]
router.get('/getStudent/lessons',auth02,pagesController.getStudentLessons)
router.get('/getStudent/schedule',auth02,pagesController.getStudentSchedule)

router.get('/getTeacher/lessons',auth02,pagesController.getTeacherLessons)
router.get('/getTeacher/schedule',auth02,pagesController.getTeacherSchedule)

//[lesson_id]
router.get('/getLesson/participants',auth02,pagesController.getLessonParticipants)


module.exports = router