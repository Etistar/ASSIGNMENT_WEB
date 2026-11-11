import User from '../models/user.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  try {
    const { name, password } = req.body
    const email = req.body.email?.toLowerCase().trim()
    const user = new User({ name, email, password, role: 'user' })
    await user.save()
    return res.status(201).json({
      message: 'User successfully created',
      user: user.toJSON()
    })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    const users = await User.find().select('name email role created updated')
    return res.status(200).json(users)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Invalid User ID' })
  }
}

const read = (req, res) => {
  return res.status(200).json(req.profile.toJSON())
}

const update = async (req, res) => {
  try {
    const user = req.profile
    const { name, password } = req.body
    const email = req.body.email?.toLowerCase().trim()
    if (name !== undefined) user.name = name
    if (req.body.email !== undefined) user.email = email
    if (password !== undefined) user.password = password
    await user.save()
    return res.status(200).json({
      message: 'User updated successfully',
      user: user.toJSON()
    })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    await req.profile.deleteOne()
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, userByID, read, update, remove }
