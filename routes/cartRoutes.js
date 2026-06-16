const express = require('express')
const { protect } = require('../middleware/auth')
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController')

const router = express.Router()

router.use(protect)

router.get('/', getCart)
router.post('/', addToCart)
router.put('/:itemId', updateCartItem)
router.delete('/:itemId', removeFromCart)
router.delete('/', clearCart)

module.exports = router
