import { z } from 'zod'

const urlSchema = z.string()
  .url('Invalid URL - please provide a valid HTTP or HTTPS URL')
  .refine(url => url.startsWith('http://') || url.startsWith('https://'), {
    message: 'URL must use HTTP or HTTPS protocol'
  })

const scrapeParamsSchema = z.object({
  url: urlSchema,
  maxAdditionalPages: z.number()
    .int('maxAdditionalPages must be an integer')
    .min(0, 'maxAdditionalPages must be non-negative')
    .max(20, 'maxAdditionalPages cannot exceed 20')
    .optional()
})

export const validateScrapeParams = (params) => {
  const result = scrapeParamsSchema.safeParse(params)
  
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.errors.map(err => err.message),
    data: result.success ? result.data : null
  }
}
