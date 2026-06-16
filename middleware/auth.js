const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/AppError')

const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      throw new AppError('Not authorized. Please log in.', 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.id === 'admin') {
      req.user = { _id: 'admin', name: 'Admin', email: process.env.ADMIN_EMAIL, role: 'admin' }
      return next()
    }

    const user = await User.findById(decoded.id)

    if (!user) {
      throw new AppError('User no longer exists', 401)
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
    next(error)
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({ success: false, message: 'Admin access required' })
}

module.exports = { protect, adminOnly }
