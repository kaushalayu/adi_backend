const errorHandler = (err, req, res, next) => {
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
