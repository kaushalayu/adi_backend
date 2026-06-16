const express = require('express')
const Banner = require('../models/Banner')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: banners })
  } catch (e) { next(e) }
})

module.exports = router
