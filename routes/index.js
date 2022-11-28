const Router = require('express')
const router = new Router()

const authRouter = require('./authRouter')
const settingsRouter = require('./settingsRouter')
const userRouter = require('./userRouter')
const lessonsRouter = require('./lessonsRouter')
const pagesRouter = require('./pagesRouter')
const statusesRouter = require('./statusesRouter')
const blogRouter = require('./blogRouter')
const scheduleRouter = require('./scheduleRouter')

router.use('/auth', authRouter)
router.use('/user',userRouter)
router.use('/settings',settingsRouter)
router.use('/lessons',lessonsRouter)
router.use('/pages',pagesRouter)
router.use('/statuses',statusesRouter)
router.use('/blog',blogRouter)
router.use('/schedule',scheduleRouter)

module.exports = router 