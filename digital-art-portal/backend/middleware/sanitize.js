const validator = require('validator');

const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = validator.escape(req.body[key]);
    }
  }
  
  // Sanitize query parameters
  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = validator.escape(req.query[key]);
    }
  }
  
  next();
};

module.exports = { sanitizeInput };