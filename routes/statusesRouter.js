const Router = require('express')

const router = new Router()

const statusesController = require('../controllers/statusesController')

const auth = require('../mw/auth')

router.post('/setStatuses', auth, statusesController.setStatuses)
router.post('/deleteStatus',auth,statusesController.deleteStatus)

module.exports = router