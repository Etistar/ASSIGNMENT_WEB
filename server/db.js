import mongoose from 'mongoose'
import config from '../config/config.js'
import ensureAdmin from './seed/ensureAdmin.js'
import seedPortfolio from './seed/seedPortfolio.js'

const mongoUri = process.env.MONGO_URI || config.mongoUri

const connectDb = () => {
  if (!global.portfolioDb) {
    global.portfolioDb = mongoose.connect(mongoUri).then(async () => {
      console.log('Connected to the database!')
      try {
        await ensureAdmin()
        await seedPortfolio()
      } catch (err) {
        console.error('Database setup failed:', err.message)
      }
    }).catch((err) => {
      global.portfolioDb = null
      console.error('unable to connect to database')
      throw err
    })
  }
  return global.portfolioDb
}

export default connectDb
