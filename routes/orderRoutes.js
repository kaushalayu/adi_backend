const express = require('express')
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const { createOrder, getOrders, getOrder, validateCoupon } = require('../controllers/orderController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('billingAddress').isObject().withMessage('Billing address is required'),
    body('billingAddress.firstName').trim().notEmpty().withMessage('First name is required'),
    body('billingAddress.lastName').trim().notEmpty().withMessage('Last name is required'),
    body('billingAddress.email').trim().isEmail().withMessage('Valid email required'),
    body('billingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
  ],
  validate,
  createOrder
)

router.get('/', protect, getOrders)

router.get('/:id', protect, getOrder)

router.post(
  '/coupons/validate',
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
  ],
  validate,
  validateCoupon
)

module.exports = router
