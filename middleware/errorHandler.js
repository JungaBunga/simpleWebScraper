import config from '../config/index.js'

const errorHandler = (error, req, res, next) => {
  console.error('Unhandled error:', error)

  const isDevelopment = config.get('env') === 'development'
  
  const response = {
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  }

  if (isDevelopment) {
    response.details = error.message
    response.stack = error.stack
  }

  res.status(500).json(response)
}

export default errorHandler