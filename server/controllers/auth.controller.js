import User from '../models/user.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'
import { generateToken } from '../utils/jwt.js'

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000
}

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || 'user',
  created: user.created,
  updated: user.updated
})

const signup = async (req, res) => {
  try {
    const { name, password } = req.body
    const email = req.body.email?.toLowerCase().trim()
    // Public sign-up can never create an administrator.
    const user = new User({ name, email, password, role: 'user' })
    await user.save()
    const token = generateToken(user)
    res.cookie('t', token, cookieOptions)
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: publicUser(user)
    })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const signin = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim()
    const { password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email }).select('+hashed_password')
    if (!user || !user.authenticate(password)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = generateToken(user)
    res.cookie('t', token, cookieOptions)
    return res.status(200).json({
      message: 'Sign-in successful',
      token,
      user: publicUser(user)
    })
  } catch (err) {
    return res.status(500).json({ error: errorHandler.getErrorMessage(err) })
  }
}

// Stateless JWT: nothing is stored server-side to revoke.
// The httpOnly cookie is cleared here. The client must delete the Bearer token.
const signout = (req, res) => {
  res.clearCookie('t', { httpOnly: true, sameSite: 'lax' })
  return res.status(200).json({
    message: 'Signed out. Remove the JWT from client storage. This API does not keep a server session.'
  })
}

const protectedRoute = (req, res) => {
  return res.status(200).json({
    message: 'Access granted to protected route',
    user: req.auth
  })
}

export default { signup, signin, signout, protectedRoute }
