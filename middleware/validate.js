const { body, validationResult } = require('express-validator');

exports.validateUser = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
  body('email').isEmail().withMessage('Email must be valid.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
