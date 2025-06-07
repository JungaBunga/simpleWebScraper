import * as cheerio from 'cheerio'

const removeUnwantedElements = ($) => {
  const unwantedSelectors = [
    'script',
    'style',
    'nav',
    'footer',
    'header',
    '.cookie-banner',
    '.cookie-notice',
    '.advertisement',
    '.ads',
    '.social-share',
    '.sidebar',
    '.menu',
    '.navigation',
    '#cookie-consent',
    '.popup',
    '.modal',
    '[class*="cookie"]',
    '[class*="banner"]',
    '[id*="cookie"]',
    '[id*="banner"]'
  ]

  unwantedSelectors.forEach(selector => {
    $(selector).remove()
  })
}

const extractCleanText = ($) => {
  const contentSelectors = [
    'main',
    '[role="main"]',
    '.main-content',
    '.content',
    'article',
    '.article',
    '.post-content',
    '.entry-content'
  ]

  let mainContent = ''
  
  for (const selector of contentSelectors) {
    const element = $(selector)
    if (element.length > 0) {
      mainContent = element.text()
      break
    }
  }

  if (!mainContent) {
    mainContent = $('body').text()
  }

  return mainContent
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

const extractMetadata = ($) => {
  return {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    keywords: $('meta[name="keywords"]').attr('content') || '',
    ogTitle: $('meta[property="og:title"]').attr('content') || '',
    ogDescription: $('meta[property="og:description"]').attr('content') || '',
    canonical: $('link[rel="canonical"]').attr('href') || ''
  }
}

const extractInternalLinks = ($, baseUrl) => {
  const links = []
  const baseUrlObj = new URL(baseUrl)

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href')
    if (!href) return

    try {
      const absoluteUrl = new URL(href, baseUrl)
      
      if (absoluteUrl.hostname === baseUrlObj.hostname) {
        const linkText = $(element).text().trim()
        if (linkText && !links.some(link => link.url === absoluteUrl.href)) {
          links.push({
            url: absoluteUrl.href,
            text: linkText.substring(0, 100)
          })
        }
      }
    } catch (error) {
    }
  })

  return links
}

const processHtmlContent = (html, url) => {
  const $ = cheerio.load(html)

  removeUnwantedElements($)

  const metadata = extractMetadata($)
  const textContent = extractCleanText($)
  const internalLinks = extractInternalLinks($, url)

  return {
    url,
    metadata,
    textContent,
    internalLinks: internalLinks.slice(0, 10),
    contentLength: textContent.length,
    scrapedAt: new Date().toISOString()
  }
}

export {
  removeUnwantedElements,
  extractCleanText,
  extractMetadata,
  extractInternalLinks,
  processHtmlContent
}