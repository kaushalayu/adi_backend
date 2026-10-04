const errorHandler = (err, req, res, next) => {
  if (err.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'File too large. Maximum size is 10MB.',
      LIMIT_FILE_COUNT: 'Too many files uploaded.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field.',
      LIMIT_FIELD_KEY: 'Field name too long.',
      LIMIT_FIELD_VALUE: 'Field value too long.',
      LIMIT_FIELD_COUNT: 'Too many fields.',
      LIMIT_PART_COUNT: 'Too many parts.',
      MISSING_FIELD_NAME: 'Field name missing.',
    }
    return res.status(400).json({
      success: false,
      message: messages[err.code] || 'Upload error',
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field}`,
    })
  }

  if (err.name === 'ValidationError') {
    const errors = {}
    for (const field of Object.keys(err.errors)) {
      errors[field] = err.errors[field].message
    }
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body' })
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body too large' })
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    })
  }

  const isProd = process.env.NODE_ENV === 'production'
  if (!isProd) console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: isProd ? 'Internal server error' : err.message,
  })
}

module.exports = errorHandler
