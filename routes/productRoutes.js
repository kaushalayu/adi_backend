const express = require('express')
const { getProducts, getProduct, getRelatedProducts } = require('../controllers/productController')
const reviewRoutes = require('./reviewRoutes')

const router = express.Router()

router.get('/', getProducts)
router.get('/:slug', getProduct)
router.get('/:slug/related', getRelatedProducts)
router.use('/:slug/reviews', reviewRoutes)

module.exports = router
