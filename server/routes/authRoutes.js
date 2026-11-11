import express from 'express'
import authCtrl from '../controllers/auth.controller.js'
import requireSignin from '../Middlewares/auth.js'

const router = express.Router()

router.post('/signup', authCtrl.signup)
router.post('/signin', authCtrl.signin)
router.post('/signout', authCtrl.signout)
router.get('/protected', requireSignin, authCtrl.protectedRoute)

export default router
