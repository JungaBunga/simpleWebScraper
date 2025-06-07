import axios from 'axios'
import config from '../config/index.js'
import { processHtmlContent } from './contentCleaner.js'

const createAxiosConfig = () => ({
  timeout: config.get('scraping.requestTimeout'),
  maxRedirects: config.get('scraping.maxRedirects'),
  headers: {
    'User-Agent': config.get('scraping.userAgent')
  }
})

const fetchPage = async (url) => {
  try {
    const response = await axios.get(url, createAxiosConfig())
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  }
}

const scrapePage = async (url) => {
  try {
    const html = await fetchPage(url)
    return processHtmlContent(html, url)
  } catch (error) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`)
  }
}

const scrapeMultiplePages = async (urls, maxConcurrent = config.get('scraping.maxConcurrentRequests')) => {
  const results = []
  
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent)
    const promises = batch.map(url => 
      scrapePage(url).catch(error => ({
        url,
        error: error.message,
        scrapedAt: new Date().toISOString()
      }))
    )
    
    const batchResults = await Promise.all(promises)
    results.push(...batchResults)
  }
  
  return results
}

const scrapeWebsite = async (options) => {
  const { 
    url, 
    scrapeAdditionalPages = false, 
    maxAdditionalPages = config.get('scraping.maxAdditionalPages')
  } = options

  const mainPageResult = await scrapePage(url)
  
  const response = {
    mainPage: mainPageResult,
    additionalPages: [],
    summary: {
      totalPages: 1,
      totalContentLength: mainPageResult.textContent.length,
      scrapedAt: new Date().toISOString()
    }
  }

  if (scrapeAdditionalPages && mainPageResult.internalLinks.length > 0) {
    const additionalUrls = mainPageResult.internalLinks
      .slice(0, maxAdditionalPages)
      .map(link => link.url)
    
    const additionalResults = await scrapeMultiplePages(additionalUrls)
    response.additionalPages = additionalResults
    
    const successfulPages = additionalResults.filter(r => !r.error)
    response.summary.totalPages += successfulPages.length
    response.summary.totalContentLength += successfulPages
      .reduce((sum, page) => sum + (page.textContent?.length || 0), 0)
  }

  return response
}

export {
  fetchPage,
  scrapePage,
  scrapeMultiplePages,
  scrapeWebsite
}