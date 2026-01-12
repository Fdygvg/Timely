const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

// Validation rules
const registerValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Username must be between 2 and 30 characters')
    .matches(/^[a-zA-Z0-9_\- ]+$/)
    .withMessage('Username can only contain letters, numbers, spaces, hyphens and underscores'),

  body('avatar')
    .optional()
    .isString()
    .withMessage('Avatar must be a string')
    .matches(/^avatar[1-9]\d*$/)
    .withMessage('Invalid avatar selection')
];

const stackValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Stack name is required')
    .isLength({ max: 100 })
    .withMessage('Stack name cannot exceed 100 characters'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),

  body('defaultDuration')
    .optional()
    .isInt({ min: 5, max: 3600 })
    .withMessage('Duration must be between 5 and 3600 seconds'),

  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),

  body('items.*.text')
    .if(body('items').exists())
    .trim()
    .notEmpty()
    .withMessage('Item text is required')
    .isLength({ max: 500 })
    .withMessage('Item text cannot exceed 500 characters')
];

const updateStackValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Stack name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Stack name cannot exceed 100 characters'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),

  body('defaultDuration')
    .optional()
    .isInt({ min: 5, max: 3600 })
    .withMessage('Duration must be between 5 and 3600 seconds'),

  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),

  body('items.*.text')
    .if(body('items').exists())
    .trim()
    .notEmpty()
    .withMessage('Item text is required')
    .isLength({ max: 500 })
    .withMessage('Item text cannot exceed 500 characters')
];

const shortcutValidation = [
  body('key')
    .trim()
    .toUpperCase()
    .isLength({ min: 1, max: 3 })
    .withMessage('Shortcut key must be 1-3 characters')
    .matches(/^[A-Z]+$/)
    .withMessage('Shortcut key can only contain letters'),

  body('text')
    .trim()
    .notEmpty()
    .withMessage('Text is required')
    .isLength({ max: 200 })
    .withMessage('Text cannot exceed 200 characters')
];

module.exports = {
  validate,
  registerValidation,
  stackValidation,
  updateStackValidation,
  shortcutValidation
};