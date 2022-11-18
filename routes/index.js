const Router = require('express')
const router = new Router()

const authRouter = require('./authRouter')
const settingsRouter = require('./settingsRouter')
const userRouter = require('./userRouter')
const lessonsRouter = require('./lessonsRouter')
const pagesRouter = require('./pagesRouter')

router.use('/auth', authRouter)
router.use('/user',userRouter)
router.use('/settings',settingsRouter)
router.use('/lessons',lessonsRouter)
router.use('/pages',pagesRouter)

module.exports = router 