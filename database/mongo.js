import mongoose from 'mongoose'
import config from '../config/index.js'

const analysisSchema = new mongoose.Schema({
  url: { type: String, required: true },
  companyName: String,
  businessDescription: String,
  location: String,
  targetCustomers: String,
  headcount: String,
  financialInfo: String,
  keyProducts: [String],
  industry: String,
  foundedYear: String,
  investmentHighlights: [String],
  risks: [String],
  processingTime: String,
  tokensUsed: Number,
  processedAt: { type: Date, default: Date.now }
})

const Analysis = mongoose.model('Analysis', analysisSchema)

let isConnected = false

const connectMongo = async () => {
  if (isConnected) return

  try {
    await mongoose.connect(config.get('database.mongodb.uri'))
    isConnected = true
    return true
  } catch (error) {
    isConnected = false
    throw error
  }
}

const saveAnalysis = async (url, aiResult) => {
  if (!isConnected) {
    await connectMongo()
  }
  
  // Validate required fields
  if (!aiResult.companyName || !aiResult.businessDescription) {
    console.warn(`⚠️ Incomplete AI result for ${url}, skipping save`)
    throw new Error('Incomplete analysis data - missing company name or description')
  }
  
  try {
    const analysis = new Analysis({
      url,
      companyName: aiResult.companyName,
      businessDescription: aiResult.businessDescription,
      location: aiResult.location || 'Not specified',
      targetCustomers: aiResult.targetCustomers || 'Not specified',
      headcount: aiResult.headcount || 'Not specified',
      financialInfo: aiResult.financialInfo || 'Not specified',
      keyProducts: aiResult.keyProducts || [],
      industry: aiResult.industry || 'Not specified',
      foundedYear: aiResult.foundedYear,
      investmentHighlights: aiResult.investmentHighlights || [],
      risks: aiResult.risks || [],
      processingTime: aiResult.processingTime,
      tokensUsed: aiResult.tokensUsed,
      processedAt: aiResult.processedAt
    })
    
    const saved = await analysis.save()
    console.log(`💾 Saved company analysis for ${aiResult.companyName}`)
    return saved._id
  } catch (error) {
    console.error('❌ Failed to save analysis:', error.message)
    throw error
  }
}

const deleteAllAnalyses = async () => {
  if (!isConnected) {
    await connectMongo()
  }
  
  try {
    const result = await Analysis.deleteMany({})
    console.log(`🗑️ Deleted all ${result.deletedCount} analyses`)
    return result.deletedCount
  } catch (error) {
    console.error('❌ Failed to delete all analyses:', error.message)
    throw error
  }
}

const getRecentAnalyses = async (limit = 10) => {
  if (!isConnected) {
    await connectMongo()
  }
  return Analysis.find().sort({ processedAt: -1 }).limit(limit)
}

const cleanupIncompleteAnalyses = async () => {
  if (!isConnected) {
    await connectMongo()
  }
  
  try {
    const result = await Analysis.deleteMany({
      $or: [
        { companyName: { $exists: false } },
        { companyName: '' },
        { businessDescription: { $exists: false } },
        { businessDescription: '' }
      ]
    })
    
    return result.deletedCount
  } catch (error) {
    console.error('❌ Failed to cleanup analyses:', error.message)
    throw error
  }
}

export { connectMongo, saveAnalysis, getRecentAnalyses, cleanupIncompleteAnalyses,deleteAllAnalyses }