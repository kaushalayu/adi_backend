const express = require('express')
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { submitContact } = require('../controllers/contactController')

const router = express.Router()

router.post(
  '/',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
    body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('phone').optional({ values: 'falsy' }).trim(),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
    body('acceptedTerms').isBoolean().withMessage('Terms acceptance is required').custom((value) => {
      if (value !== true) throw new Error('You must accept the terms & conditions')
      return true
    }),
  ],
  validate,
  submitContact
)

module.exports = router
