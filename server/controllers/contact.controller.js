import Contact from '../models/contact.model.js'
import errorHandler from '../helpers/dbErrorHandler.js'

const create = async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()
    return res.status(201).json({ message: 'Contact added successfully', contact })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ created: -1 })
    return res.status(200).json(contacts)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id)
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    req.contact = contact
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Invalid Contact ID' })
  }
}

const read = (req, res) => res.status(200).json(req.contact)

const update = async (req, res) => {
  try {
    const contact = Object.assign(req.contact, req.body)
    await contact.save()
    return res.status(200).json({ message: 'Contact updated successfully', contact })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    await req.contact.deleteOne()
    return res.status(200).json({ message: 'Contact deleted successfully' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, contactByID, read, update, remove }
