const { validationResult } = require('express-validator')
const AppError = require('../utils/AppError')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formatted = errors.array().reduce((acc, err) => {
      acc[err.path] = err.msg
      return acc
    }, {})
    return next(new AppError('Validation failed', 400, formatted))
  }
  next()
}

module.exports = validate
