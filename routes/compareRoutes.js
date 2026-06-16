const express = require('express')
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { getCompare, addToCompare, removeFromCompare } = require('../controllers/compareController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, getCompare)

router.post(
  '/',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID is required').isMongoId().withMessage('Invalid product ID'),
  ],
  validate,
  addToCompare
)

router.delete('/:productId', protect, removeFromCompare)

module.exports = router
