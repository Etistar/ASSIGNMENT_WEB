import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/Portfolio'
}

export default config
