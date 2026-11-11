import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title is required'
  },
  completion: {
    type: Date,
    required: 'Completion date is required'
  },
  description: {
    type: String,
    trim: true,
    required: 'Description is required'
  },
  role: {
    type: String,
    trim: true
  },
  outcome: {
    type: String,
    trim: true
  },
  technologies: {
    type: [String],
    default: []
  },
  demoLink: {
    type: String,
    trim: true
  }
})

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
