import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: 'First name is required'
  },
  lastName: {
    type: String,
    trim: true,
    required: 'Last name is required'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    required: 'Message is required'
  },
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
