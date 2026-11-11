import config from './config/config.js'
import app from './server/express.js'
import connectDb from './server/db.js'

// Vercel runs the API as a serverless function and sets VERCEL.
// Local development still starts a normal Node server.
if (!process.env.VERCEL) {
  connectDb()
    .catch(() => {})
    .finally(() => {
      app.listen(config.port, (err) => {
        if (err) {
          console.log(err)
        }
        console.info('Server started on port %s.', config.port)
      })
    })
}

export default app
