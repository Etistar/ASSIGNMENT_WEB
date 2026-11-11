import Qualification from '../models/qualification.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  try {
    const qualification = new Qualification(req.body)
    await qualification.save()
    return res.status(201).json({ message: 'Qualification added successfully', qualification })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    const qualifications = await Qualification.find().sort({ completion: -1 })
    return res.status(200).json(qualifications)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const qualificationByID = async (req, res, next, id) => {
  try {
    const qualification = await Qualification.findById(id)
    if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
    req.qualification = qualification
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Invalid Qualification ID' })
  }
}

const read = (req, res) => res.status(200).json(req.qualification)

const update = async (req, res) => {
  try {
    const qualification = Object.assign(req.qualification, req.body)
    await qualification.save()
    return res.status(200).json({ message: 'Qualification updated successfully', qualification })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    await req.qualification.deleteOne()
    return res.status(200).json({ message: 'Qualification deleted successfully' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, qualificationByID, read, update, remove }
