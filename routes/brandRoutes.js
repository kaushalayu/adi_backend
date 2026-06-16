const express = require('express')
const Brand = require('../models/Brand')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 })
    res.json({ success: true, data: brands })
  } catch (e) { next(e) }
})

module.exports = router
