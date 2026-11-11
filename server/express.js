import express from 'express'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import apiRoutes from './routes/api.routes.js'

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }
  return next(err)
})
app.use(cookieParser())
app.use(compress())
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  // Portfolio pages use style attributes. The default policy blocks them.
  contentSecurityPolicy: false
}))
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}))
app.use('/', apiRoutes)

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.resolve(__dirname, '../client/build')
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath))
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'))
    })
  }
}

export default app
