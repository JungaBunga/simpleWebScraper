import express from 'express'
import { validateScrapeParams } from '../utils/validation.js'
import { scrapeWebsite } from '../utils/websiteScraper.js'
import { processWithAI, processBatch, isAIAvailable } from '../utils/aiProcessor.js'
import { getRecentAnalyses, cleanupIncompleteAnalyses,deleteAllAnalyses } from '../database/mongo.js'
import config from '../config/index.js'

const router = express.Router()

router.get('/ai-status', (req, res) => {
  res.json({
    aiEnabled: config.get('ai.enabled'),
    hasApiKey: !!config.get('ai.google.apiKey'),
    isAvailable: isAIAvailable(),
    message: isAIAvailable() ? 'AI ready' : 'AI not available'
  })
})

router.get('/analyses', async (req, res) => {
  try {
    const analyses = await getRecentAnalyses(20)
    res.json({
      count: analyses.length,
      companies: analyses.map(a => ({
        id: a._id,
        url: a.url,
        companyName: a.companyName,
        businessDescription: a.businessDescription,
        location: a.location,
        targetCustomers: a.targetCustomers,
        headcount: a.headcount,
        financialInfo: a.financialInfo,
        keyProducts: a.keyProducts,
        industry: a.industry,
        foundedYear: a.foundedYear,
        investmentHighlights: a.investmentHighlights,
        risks: a.risks,
        processingTime: a.processingTime,
        tokensUsed: a.tokensUsed,
        processedAt: a.processedAt
      }))
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/analyses/cleanup', async (req, res) => {
  try {
    const deletedCount = await cleanupIncompleteAnalyses()
    
    res.json({
      message: 'Cleanup completed',
      deletedCount
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/analyses/all', async (req, res) => {
  try {
    const deletedCount = await deleteAllAnalyses()
    
    res.json({
      message: 'All analyses deleted',
      deletedCount
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/scrape', async (req, res, next) => {
  try {
    const { 
      url, 
      scrapeAdditionalPages = false, 
      maxAdditionalPages = 5,
      aiSummary = false
    } = req.body

    const validation = validateScrapeParams({ url, maxAdditionalPages })
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      })
    }

    const scrapingResult = await scrapeWebsite({
      url,
      scrapeAdditionalPages,
      maxAdditionalPages
    })

    if (!aiSummary || !isAIAvailable()) {
      return res.json({
        ...scrapingResult,
        aiEnabled: isAIAvailable(),
        aiProcessed: false
      })
    }

    // Process main page with AI
    const mainPageAnalysis = await processWithAI(
      scrapingResult.mainPage.textContent, 
      scrapingResult.mainPage.url
    )

    // Process additional pages if any
    let additionalPagesWithAI = scrapingResult.additionalPages
    if (scrapingResult.additionalPages.length > 0) {
      additionalPagesWithAI = await processBatch(scrapingResult.additionalPages)
    }

    res.json({
      ...scrapingResult,
      mainPage: {
        ...scrapingResult.mainPage,
        aiAnalysis: mainPageAnalysis
      },
      additionalPages: additionalPagesWithAI,
      aiEnabled: true,
      aiProcessed: true
    })

  } catch (error) {
    console.error('Scraping error:', error)
    
    if (error.message.includes('Failed to fetch') || error.message.includes('timeout')) {
      return res.status(502).json({
        error: 'Website unreachable',
        message: 'Unable to fetch content from the specified URL'
      })
    }

    next(error)
  }
})

export default router