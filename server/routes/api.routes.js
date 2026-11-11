import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import contactCtrl from '../controllers/contact.controller.js'
import projectCtrl from '../controllers/project.controller.js'
import qualificationCtrl from '../controllers/qualification.controller.js'
import authRoutes from './authRoutes.js'
import requireSignin, { requireAdmin } from '../Middlewares/auth.js'

const router = express.Router()
const adminOnly = [requireSignin, requireAdmin]

router.get('/api/health', (req, res) => {
  res.json({ message: 'Welcome to My Portfolio application.' })
})

router.use('/api/auth', authRoutes)

router.route('/api/users')
  .get(...adminOnly, userCtrl.list)
  .post(...adminOnly, userCtrl.create)

router.route('/api/users/:userId')
  .get(...adminOnly, userCtrl.read)
  .put(...adminOnly, userCtrl.update)
  .delete(...adminOnly, userCtrl.remove)

// Visitors can send a message. Only an administrator can read or change messages.
router.route('/api/contacts')
  .get(...adminOnly, contactCtrl.list)
  .post(contactCtrl.create)

router.route('/api/contacts/:contactId')
  .get(...adminOnly, contactCtrl.read)
  .put(...adminOnly, contactCtrl.update)
  .delete(...adminOnly, contactCtrl.remove)

// Everyone can read projects and qualifications. Writes are administrator-only.
router.route('/api/projects')
  .get(projectCtrl.list)
  .post(...adminOnly, projectCtrl.create)

router.route('/api/projects/:projectId')
  .get(projectCtrl.read)
  .put(...adminOnly, projectCtrl.update)
  .delete(...adminOnly, projectCtrl.remove)

router.route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(...adminOnly, qualificationCtrl.create)

router.route('/api/qualifications/:qualificationId')
  .get(qualificationCtrl.read)
  .put(...adminOnly, qualificationCtrl.update)
  .delete(...adminOnly, qualificationCtrl.remove)

router.param('userId', userCtrl.userByID)
router.param('contactId', contactCtrl.contactByID)
router.param('projectId', projectCtrl.projectByID)
router.param('qualificationId', qualificationCtrl.qualificationByID)

export default router
