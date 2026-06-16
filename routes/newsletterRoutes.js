const express = require('express')
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { subscribe, unsubscribe } = require('../controllers/newsletterController')

const router = express.Router()

router.post(
  '/subscribe',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  ],
  validate,
  subscribe
)

router.post(
  '/unsubscribe',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  ],
  validate,
  unsubscribe
)

module.exports = router
