import { analyzeAndSave } from './singleAnalysis.js'
import { isAIAvailable } from './availability.js'

const processBatch = async (pages) => {
  if (!isAIAvailable()) {
    return pages.map(page => ({
      ...page,
      aiAnalysis: { error: 'AI disabled' }
    }))
  }

  const results = []
  for (const page of pages) {
    if (page.textContent && page.textContent.length > 100) {
      const analysis = await analyzeAndSave(page.textContent, page.url)
      results.push({
        ...page,
        aiAnalysis: analysis
      })
    } else {
      results.push({
        ...page,
        aiAnalysis: { error: 'No content to analyze' }
      })
    }
  }
  
  return results
}

export { processBatch }