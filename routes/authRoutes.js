const express = require('express')
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
)

router.post(
  '/login',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

router.get('/me', protect, getMe)

router.post(
  '/forgot-password',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
  ],
  validate,
  forgotPassword
)

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
)

module.exports = router
