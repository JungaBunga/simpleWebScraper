# Website Content Scraper API

A  Node.js application for scraping websites and generating AI-powered investment analysis using ES6 modules, MongoDB storage, and Google's Gemini AI.

## 🚀 Key Features

- **Website Content Scraping**: Extract clean, structured content from any website
- **AI-Powered Analysis**: Generate investment-focused company analysis using Google Gemini
- **Batch Processing**: Scrape and analyze multiple pages concurrently
- **Database Storage**: Persistent storage of analysis results in MongoDB
- **Docker Support**: Full containerization with Docker Compose
- **Modern Architecture**: ES6 modules, async/await, and modular design
- **Configuration Management**: Schema-based configuration with environment validation

## 📁 Project Structure

```
website-content-scraper/
├── index.js                    # Application entry point
├── server.js                   # Express server configuration
├── package.json               # Dependencies and scripts
├── docker-compose.yml         # Docker services configuration
├── dockerfile                 # Application container
├── config/
│   └── index.js               # Convict-based configuration schema
├── database/
│   └── mongo.js               # MongoDB connection and models
├── middleware/
│   └── errorHandler.js        # Express error handling
├── routes/
│   └── scrape.js              # API route definitions
└── utils/
    ├── aiProcessor.js         # AI processing orchestration
    ├── contentCleaner.js      # HTML content processing
    ├── websiteScraper.js      # Web scraping utilities
    ├── validation.js          # Input validation schemas
    └── ai/
        ├── availability.js    # AI service availability checks
        ├── batchAnalysis.js   # Batch processing for multiple pages
        ├── processing.js      # Core AI processing logic
        ├── prompts.js         # AI prompt templates
        └── singleAnalysis.js  # Individual page analysis
```

## 🛠 Installation & Setup

### Prerequisites

- Node.js 14+ 
- MongoDB (local installation or Docker)
- Google AI API key (for Gemini)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd website-content-scraper
npm install
```

### 2. Environment Configuration

Create your environment file:

```bash
cp .env.example .env
```

Configure your `.env` file:

```bash
# Application
NODE_ENV=development
PORT=3000

# Scraping Configuration
SCRAPING_REQUEST_TIMEOUT=30000
SCRAPING_MAX_REDIRECTS=5
SCRAPING_MAX_CONCURRENT_REQUESTS=3
SCRAPING_MAX_ADDITIONAL_PAGES=10

# AI Configuration
AI_ENABLED=true
AI_PROVIDER=google
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
GOOGLE_AI_MODEL=gemini-1.5-flash
AI_TIMEOUT=30000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/webscraper
MONGODB_MAX_POOL_SIZE=10
MONGODB_TIMEOUT=5000
SAVE_RESPONSES=true
```

### 3. Start the Application

## 🐳 Docker Commands

docker-compose up --build to start the service


## 📊 Configuration Schema

| Category | Field | Type | Default | Environment Variable | Description |
|----------|-------|------|---------|---------------------|-------------|
| **App** | `env` | String | `development` | `NODE_ENV` | Application environment |
| **App** | `port` | Port | `3000` | `PORT` | Server port |
| **Scraping** | `requestTimeout` | Number | `30000` | `SCRAPING_REQUEST_TIMEOUT` | Request timeout (ms) |
| **Scraping** | `maxRedirects` | Number | `5` | `SCRAPING_MAX_REDIRECTS` | Max redirects to follow |
| **Scraping** | `maxConcurrentRequests` | Number | `3` | `SCRAPING_MAX_CONCURRENT_REQUESTS` | Concurrent request limit |
| **Scraping** | `maxAdditionalPages` | Number | `10` | `SCRAPING_MAX_ADDITIONAL_PAGES` | Max additional pages to scrape |
| **AI** | `enabled` | Boolean | `true` | `AI_ENABLED` | Enable AI analysis |
| **AI** | `provider` | String | `google` | `AI_PROVIDER` | AI provider selection |
| **AI** | `apiKey` | String | `""` | `GOOGLE_AI_API_KEY` | Google AI API key |
| **AI** | `model` | String | `gemini-1.5-flash` | `GOOGLE_AI_MODEL` | AI model to use |
| **Database** | `uri` | String | `mongodb://localhost:27017/webscraper` | `MONGODB_URI` | MongoDB connection string |
| **Database** | `saveResponses` | Boolean | `true` | `SAVE_RESPONSES` | Save AI responses to database |

## 🔌 API Endpoints

#### AI Service Status
```http
GET /ai-status
```

**Response:**
```json
{
  "aiEnabled": true,
  "hasApiKey": true,
  "isAvailable": true,
  "message": "AI ready"
}
```

### Content Scraping & Analysis

#### Scrape Website
```http
POST /scrape
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "scrapeAdditionalPages": true,
  "maxAdditionalPages": 5,
  "aiSummary": true
}
```

**Response:**

Example response returned from analysys

```json
{
  "mainPage": {
    "url": "https://example.com",
    "metadata": {
      "title": "Company Name",
      "description": "Company description"
    },
    "textContent": "Cleaned text content...",
    "aiAnalysis": {
      "companyName": "Example Corp",
      "businessDescription": "What the company does...",
      "industry": "Technology",
      "investmentHighlights": ["Key point 1", "Key point 2"],
      "processingTime": "1500ms",
      "savedToDatabase": true
    }
  },
  "additionalPages": [...],
  "summary": {
    "totalPages": 6,
    "totalContentLength": 50000,
    "scrapedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Analysis Management

#### View Recent Analyses
```http
GET /analyses
```

#### Cleanup Incomplete Analyses
```http
DELETE /analyses/cleanup
```

#### Delete All Analyses
```http
DELETE /analyses/all
```

## 💻 Usage Examples

### Basic Website Scraping

```bash
curl -X POST http://localhost:3000/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Full Analysis with AI

```bash
curl -X POST http://localhost:3000/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "scrapeAdditionalPages": true,
    "maxAdditionalPages": 3,
    "aiSummary": true
  }'
```

### Check AI Status

This is required for future multi-model handling

```bash
curl http://localhost:3000/ai-status
```

## 🧠 AI Analysis Features

The AI analysis provides investment-focused insights including:

- **Company Overview**: Name, description, and location
- **Business Intelligence**: Target customers, employee count, financial info
- **Investment Analysis**: Key highlights and potential risks
- **Market Context**: Industry classification and competitive positioning
- **Data Persistence**: All analyses saved to MongoDB for future reference