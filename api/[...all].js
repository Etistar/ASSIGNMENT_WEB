import app from '../server/express.js'
import connectDb from '../server/db.js'

// Vercel may pass /api/projects, or only the catch-all pieces in req.query.all.
const restoreApiPath = (req) => {
  if (req.url && req.url.startsWith('/api/')) return
  const all = req.query && req.query.all
  if (!all) return
  const parts = Array.isArray(all) ? all : [all]
  const query = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  req.url = `/api/${parts.join('/')}${query}`
}

export default async function handler(req, res) {
  try {
    await connectDb()
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed' })
  }
  restoreApiPath(req)
  return app(req, res)
}
