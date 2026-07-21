const express = require('express')
const Portfolio = require('../models/Portfolio')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const items = await Portfolio.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: items })
  } catch (e) { next(e) }
})

module.exports = router
