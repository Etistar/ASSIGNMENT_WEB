import User from '../models/user.model.js'

const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || 'Administrator'

  if (!email || !password) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD is missing. No administrator was seeded.')
    return
  }
  if (password.length < 6) {
    console.warn('ADMIN_PASSWORD must be at least 6 characters. No administrator was seeded.')
    return
  }

  const existing = await User.findOne({ email })
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin'
      await existing.save()
      console.log('Existing account promoted to administrator.')
    }
    return
  }

  const admin = new User({ name, email, password, role: 'admin' })
  await admin.save()
  console.log('Administrator account is ready.')
}

export default ensureAdmin
