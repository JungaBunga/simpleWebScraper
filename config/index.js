import convict from 'convict'

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  scraping: {
    requestTimeout: {
      doc: 'Request timeout in milliseconds',
      format: 'nat',
      default: 30000,
      env: 'SCRAPING_REQUEST_TIMEOUT'
    },
    maxRedirects: {
      doc: 'Maximum number of redirects to follow',
      format: 'nat',
      default: 5,
      env: 'SCRAPING_MAX_REDIRECTS'
    },
    maxConcurrentRequests: {
      doc: 'Maximum concurrent requests',
      format: 'nat',
      default: 3,
      env: 'SCRAPING_MAX_CONCURRENT_REQUESTS'
    },
    maxAdditionalPages: {
      doc: 'Maximum additional pages to scrape',
      format: 'nat',
      default: 10,
      env: 'SCRAPING_MAX_ADDITIONAL_PAGES'
    },
    userAgent: {
      doc: 'User agent string for requests',
      format: String,
      default: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      env: 'SCRAPING_USER_AGENT'
    }
  },
  ai: {
    enabled: {
      doc: 'Enable AI summarization',
      format: Boolean,
      default: true,
      env: 'AI_ENABLED'
    },
    provider: {
      doc: 'AI provider to use',
      format: ['google', 'disabled'],
      default: 'google',
      env: 'AI_PROVIDER'
    },
    google: {
      apiKey: {
        doc: 'Google AI API key',
        format: String,
        default: '',
        env: 'GOOGLE_AI_API_KEY',
        sensitive: true
      },
      model: {
        doc: 'Google AI model to use',
        format: String,
        default: 'gemini-1.5-flash',
        env: 'GOOGLE_AI_MODEL'
      },
      timeout: {
        doc: 'AI request timeout in milliseconds',
        format: 'nat',
        default: 30000,
        env: 'AI_TIMEOUT'
      }
    }
  },
  database: {
    mongodb: {
      uri: {
        doc: 'MongoDB connection URI',
        format: String,
        default: 'mongodb://localhost:27017/webscraper',
        env: 'MONGODB_URI'
      },
      options: {
        maxPoolSize: {
          doc: 'Maximum number of connections',
          format: 'nat',
          default: 10,
          env: 'MONGODB_MAX_POOL_SIZE'
        },
        serverSelectionTimeoutMS: {
          doc: 'Server selection timeout',
          format: 'nat',
          default: 5000,
          env: 'MONGODB_TIMEOUT'
        }
      }
    },
    saveResponses: {
      doc: 'Save AI responses to database',
      format: Boolean,
      default: true,
      env: 'SAVE_RESPONSES'
    }
  }
})

config.validate({ allowed: 'strict' })

export default config
