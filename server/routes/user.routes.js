import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import contactCtrl from '../controllers/contact.controller.js'
import projectCtrl from '../controllers/project.controller.js'
import qualificationCtrl from '../controllers/qualification.controller.js'

const router = express.Router()

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/:userId')
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove)

router.route('/api/contacts')
  .get(contactCtrl.list)
  .post(contactCtrl.create)

router.route('/api/contacts/:contactId')
  .get(contactCtrl.read)
  .put(contactCtrl.update)
  .delete(contactCtrl.remove)

router.route('/api/projects')
  .get(projectCtrl.list)
  .post(projectCtrl.create)

router.route('/api/projects/:projectId')
  .get(projectCtrl.read)
  .put(projectCtrl.update)
  .delete(projectCtrl.remove)

router.route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(qualificationCtrl.create)

router.route('/api/qualifications/:qualificationId')
  .get(qualificationCtrl.read)
  .put(qualificationCtrl.update)
  .delete(qualificationCtrl.remove)

router.param('userId', userCtrl.userByID)
router.param('contactId', contactCtrl.contactByID)
router.param('projectId', projectCtrl.projectByID)
router.param('qualificationId', qualificationCtrl.qualificationByID)

export default router
