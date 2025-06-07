import { processWithAI } from './processing.js'
import { saveAnalysis } from '../../database/mongo.js'

const analyzeAndSave = async (content, url) => {
  try {
    console.log(`🤖 Analyzing: ${url}`)
    
    const aiResult = await processWithAI(content, url)
    const savedId = await saveAnalysis(url, aiResult)
    
    return {
      ...aiResult,
      savedToDatabase: true,
      databaseId: savedId
    }
  } catch (error) {
    console.error('❌ Analysis failed:', error.message)
    return {
      error: error.message,
      savedToDatabase: false
    }
  }
}

export { analyzeAndSave }