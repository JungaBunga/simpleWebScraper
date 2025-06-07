import 'dotenv/config'
import server from './server.js'
import config from './config/index.js'
import { connectMongo } from './database/mongo.js'

console.log('🔧 Configuration Debug:')
console.log('AI Enabled:', config.get('ai.enabled'))
console.log('Has API Key:', !!config.get('ai.google.apiKey'))
console.log('API Key Preview:', config.get('ai.google.apiKey') ? 
  config.get('ai.google.apiKey').substring(0, 10) + '...' : 'NOT SET')
console.log('MongoDB URI:', config.get('database.mongodb.uri'))

const startServer = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await connectMongo()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.warn('⚠️ Database connection failed:', error.message)
    console.warn('🚀 Starting server without database (AI analysis will work but not save)')
  }

  server.listen(config.get('port'), () => {
    console.log(`🚀 Website Content Scraper API running on port ${config.get('port')}`)
    console.log(`📡 Health check: http://localhost:${config.get('port')}/health`)
    console.log(`🔍 Scrape endpoint: POST http://localhost:${config.get('port')}/scrape`)
    console.log(`🤖 AI Status endpoint: GET http://localhost:${config.get('port')}/ai-status`)
    console.log(`📊 Analyses endpoint: GET http://localhost:${config.get('port')}/analyses`)
  })
}

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`)
  
  server.close(async () => {
    try {
      console.log('🔌 Closing database connections...')
      const mongoose = await import('mongoose')
      await mongoose.default.disconnect()
      console.log('✅ Database disconnected')
    } catch (error) {
      console.warn('⚠️ Error during database shutdown:', error.message)
    }
    
    console.log('Process terminated')
    process.exit(0)
  })
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

startServer()