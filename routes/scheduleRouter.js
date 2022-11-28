const Router = require('express')

const router = new Router()

const statusesController = require('../controllers/statusesController')
const scheduleController = require('../controllers/scheduleController')

const auth = require('../mw/auth')

router.post('/addAppointment', auth, scheduleController.addAppointment)
router.post('/changeAppointment',auth, scheduleController.changeAppointment)
router.post('/deleteAppointment',auth, scheduleController.deleteAppointment)

module.exports = router