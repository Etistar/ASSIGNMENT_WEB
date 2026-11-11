import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  hashed_password: {
    type: String,
    required: 'Password is required',
    select: false
  },
  salt: {
    type: String,
    select: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
})

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password
    if (!password) return
    this.salt = bcrypt.genSaltSync(10)
    this.hashed_password = bcrypt.hashSync(password, this.salt)
  })
  .get(function () {
    return this._password
  })

UserSchema.path('hashed_password').validate(function () {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

UserSchema.pre('save', function () {
  this.updated = Date.now()
})

UserSchema.methods.authenticate = function (plainText) {
  return bcrypt.compareSync(plainText, this.hashed_password)
}

UserSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.hashed_password
    delete ret.salt
    delete ret.__v
    return ret
  }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
