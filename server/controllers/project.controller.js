import Project from '../models/project.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  try {
    const project = new Project(req.body)
    await project.save()
    return res.status(201).json({ message: 'Project added successfully', project })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    const projects = await Project.find().sort({ completion: -1 })
    return res.status(200).json(projects)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    req.project = project
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Invalid Project ID' })
  }
}

const read = (req, res) => res.status(200).json(req.project)

const update = async (req, res) => {
  try {
    const project = Object.assign(req.project, req.body)
    await project.save()
    return res.status(200).json({ message: 'Project updated successfully', project })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    await req.project.deleteOne()
    return res.status(200).json({ message: 'Project deleted successfully' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, projectByID, read, update, remove }
