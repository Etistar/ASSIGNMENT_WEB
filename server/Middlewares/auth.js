import jwt from 'jsonwebtoken'
import config from '../../config/config.js'
import User from '../models/user.model.js'

const requireSignin = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  let token = null

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (req.cookies && req.cookies.t) {
    token = req.cookies.t
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' })
  }

  try {
    req.auth = jwt.verify(token, config.jwtSecret)
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Confirms the role from the database, not only from the token claim.
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id).select('name email role')
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required' })
    }
    req.profile = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export { requireAdmin }
export default requireSignin
