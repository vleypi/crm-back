const Router = require('express')
const router = new Router()
const authRouter = require('./authRouter')
const settingsRouter = require('./settingsRouter')

router.use('/auth', authRouter)
router.use('/settings',settingsRouter)

module.exports = router 