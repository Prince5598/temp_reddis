const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const mongoSanitize = (obj) => {
  const clean = {};
  for (let key in obj) {
    if (key.startsWith('$') || key.includes('.')) continue; // Mongo injection pattern
    clean[key] = typeof obj[key] === 'string' ? DOMPurify.sanitize(obj[key]) : obj[key];
  }
  return clean;
};

function sanitizeRequest(req, res, next) {
  if (req.body) req.body = mongoSanitize({ ...req.body});
  if (req.query) req.query = mongoSanitize({ ...req.query }); // Avoid direct mutation
  if (req.params) req.params = mongoSanitize({ ...req.params });
 
  next();
}

module.exports = sanitizeRequest;
