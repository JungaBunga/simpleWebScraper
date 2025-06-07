import { GoogleGenerativeAI } from '@google/generative-ai'
import config from '../../config/index.js'
import { createPrompt } from './prompts.js'

let genAI = null

const initAI = () => {
  if (!genAI && config.get('ai.google.apiKey')) {
    genAI = new GoogleGenerativeAI(config.get('ai.google.apiKey'))
  }
  return genAI
}

const processWithAI = async (content, url) => {
  const ai = initAI()
  if (!ai) {
    throw new Error('AI not initialized - check API key')
  }

  if (!content || content.length < 100) {
    throw new Error('Content too short for analysis')
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = createPrompt(content, url)
    
    const startTime = Date.now()
    const result = await model.generateContent(prompt)
    const processingTime = Date.now() - startTime
    
    const response = await result.response
    const text = response.text()
    
    // Clean and parse JSON
    let cleanText = text.trim()
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    }
    
    const analysis = JSON.parse(cleanText)
    
    return {
      ...analysis,
      processingTime: `${processingTime}ms`,
      tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      processedAt: new Date()
    }
  } catch (error) {
    throw new Error(`AI processing failed: ${error.message}`)
  }
}

export { processWithAI }