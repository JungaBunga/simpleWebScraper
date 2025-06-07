import config from '../../config/index.js'

const isAIAvailable = () => {
  return config.get('ai.enabled') && config.get('ai.google.apiKey')
}

export { isAIAvailable }
