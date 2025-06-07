# Website Content Scraper API

A modular Node.js application for scraping and extracting clean content from websites using ES6 modules and schema-based configuration.

## Project Structure

```
website-content-scraper/
├── index.js                 # Entry point
├── server.js               # Express server setup
├── package.json            # Dependencies (ES6 modules)
├── .gitignore             # Git ignore rules
├── .env.example           # Environment variables example
├── config/
│   └── index.js            # Convict-based configuration schema
├── middleware/
│   └── errorHandler.js     # Error handling
├── routes/
│   └── scrape.js           # API routes
└── utils/
    ├── contentCleaner.js   # Content processing
    ├── websiteScraper.js   # Scraping logic
    └── validation.js       # Input validation
```

## Key Features

### ES6 Modules
- Uses native ES6 `import`/`export` syntax
- Modern JavaScript module system
- Tree-shaking support for better performance
- `"type": "module"` in package.json

### Schema-Based Configuration
- **Convict** for robust configuration management
- Environment variable validation
- Type checking and default values
- Strict validation to catch configuration errors early

### StandardJS Compliant
- Clean, consistent code style
- No semicolons, single quotes
- 2-space indentation

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file and customize:
```bash
cp .env.example .env
```

Edit `.env` with your preferred settings:
```bash
NODE_ENV=development
PORT=3000
SCRAPING_REQUEST_TIMEOUT=30000
SCRAPING_MAX_REDIRECTS=5
SCRAPING_MAX_CONCURRENT_REQUESTS=3
SCRAPING_MAX_ADDITIONAL_PAGES=10
```

### 3. Start the Application
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Configuration Schema

The application uses Convict for configuration management with the following schema:

| Field | Type | Default | Environment Variable | Description |
|-------|------|---------|---------------------|-------------|
| `env` | String | `development` | `NODE_ENV` | Application environment |
| `port` | Port | `3000` | `PORT` | Server port |
| `scraping.requestTimeout` | Number | `30000` | `SCRAPING_REQUEST_TIMEOUT` | Request timeout (ms) |
| `scraping.maxRedirects` | Number | `5` | `SCRAPING_MAX_REDIRECTS` | Max redirects to follow |
| `scraping.maxConcurrentRequests` | Number | `3` | `SCRAPING_MAX_CONCURRENT_REQUESTS` | Max concurrent requests |
| `scraping.maxAdditionalPages` | Number | `10` | `SCRAPING_MAX_ADDITIONAL_PAGES` | Max additional pages |
| `scraping.userAgent` | String | Chrome UA | `SCRAPING_USER_AGENT` | User agent string |

## API Usage

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Health Check
```
GET /health
```

#### Scrape Website
```
POST /scrape
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "scrapeAdditionalPages": false,
  "maxAdditionalPages": 5
}
```

### Example Requests

#### Basic Scraping
```bash
curl -X POST http://localhost:3000/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### Scrape with Additional Pages
```bash
curl -X POST http://localhost:3000/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "scrapeAdditionalPages": true,
    "maxAdditionalPages": 3
  }'
```

## Development Features

### Modern JavaScript
- ES6 modules with `import`/`export`
- Async/await throughout
- Template literals
- Destructuring assignments
- Arrow functions

### Configuration Benefits
- **Type Safety**: Convict validates configuration types
- **Environment Flexibility**: Easy environment-specific configs
- **Documentation**: Self-documenting configuration schema
- **Error Prevention**: Fails fast on invalid configuration

### Code Quality
- StandardJS for consistent style
- No comments/JSDoc for clean code
- Descriptive function and variable names
- Pure functions for better testability

## Architecture Benefits

### Modular Design
- Clear separation of concerns
- Easy to test individual components
- Simple to extend functionality
- Minimal coupling between modules

### Configuration Management
- Centralized configuration with validation
- Environment-aware settings
- Type-safe configuration access
- Clear documentation of all settings

### Modern Standards
- Latest JavaScript features
- Industry-standard tools (Convict, StandardJS)
- Production-ready error handling
- Graceful shutdown support

## Security Considerations

- Input validation on all endpoints
- Request timeouts to prevent hanging
- User agent rotation capability
- No sensitive data exposure in errors (production)
- Configuration validation prevents misconfigurations

## Performance Features

- Concurrent request limiting
- Batch processing for multiple pages
- Efficient content cleaning algorithms
- Memory-conscious link discovery
- Request timeout management

## Limitations

- Does not handle JavaScript-heavy websites requiring browser automation
- Rate limiting should be implemented for production use
- No authentication system included
- Memory usage scales with content size

## Environment Variables

All configuration can be overridden via environment variables. See `.env.example` for available options.