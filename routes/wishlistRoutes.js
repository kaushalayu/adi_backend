const express = require('express')
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, getWishlist)

router.post(
  '/',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID is required').isMongoId().withMessage('Invalid product ID'),
  ],
  validate,
  addToWishlist
)

router.delete('/:productId', protect, removeFromWishlist)

module.exports = router
