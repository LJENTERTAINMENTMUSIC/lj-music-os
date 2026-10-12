/**
 * Vercel Serverless Function Entry Point for LJ Music OS
 * Routes all incoming serverless requests to the Express application.
 */
const app = require('../server');

module.exports = (req, res) => {
  // Restore original path if rewritten to /api/index.js
  const matchedPath = req.headers['x-matched-path'] || req.headers['x-vercel-matched-path'] || req.headers['x-forwarded-uri'];
  if (matchedPath && (req.url === '/api/index.js' || req.url === '/api' || req.url === '/api/index' || req.url.startsWith('/api/index.js'))) {
    req.url = matchedPath;
  }
  return app(req, res);
};
