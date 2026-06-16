const express = require('express')
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { getProductReviews, submitReview } = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router.get('/', getProductReviews)

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('content').trim().notEmpty().withMessage('Review content is required'),
  ],
  validate,
  submitReview
)

module.exports = router
