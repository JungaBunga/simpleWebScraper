const createPrompt = (content, url) => {
  return `You are analyzing a company based on their website content from ${url}.

Using the information provided, write a summary that an investment professional would care about.

Website content:
${content.substring(0, 8000)}

Extract and return as JSON:
{
  "companyName": "Full company name",
  "businessDescription": "What the company does in 2-3 sentences",
  "location": "Where the company is based (city, country)",
  "targetCustomers": "Who their target customers are",
  "headcount": "Number of employees or size indication",
  "financialInfo": "Any revenue, funding, or financial details mentioned",
  "keyProducts": ["Main products or services"],
  "industry": "Primary industry/sector",
  "foundedYear": "Year founded if mentioned",
  "investmentHighlights": ["Key points an investor would care about"],
  "risks": ["Potential concerns or risks identified"]
}`
}

export { createPrompt }