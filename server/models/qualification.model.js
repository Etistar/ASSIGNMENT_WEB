import mongoose from 'mongoose'

const QualificationSchema = new mongoose.Schema({
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
  institution: {
    type: String,
    trim: true
  },
  period: {
    type: String,
    trim: true
  },
  credential: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  }
})

export default mongoose.models.Qualification || mongoose.model('Qualification', QualificationSchema)
