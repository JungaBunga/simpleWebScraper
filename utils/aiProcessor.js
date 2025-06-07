import { analyzeAndSave } from './ai/singleAnalysis.js'
import { processBatch } from './ai/batchAnalysis.js'
import { isAIAvailable } from './ai/availability.js'

export {
  analyzeAndSave as processWithAI,
  processBatch,
  isAIAvailable
}