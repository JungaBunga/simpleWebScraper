import express from 'express'
import scrapeRoutes from './routes/scrape.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', scrapeRoutes)

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Website Content Scraper API'
  })
})

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  })
})

app.use(errorHandler)

export default app