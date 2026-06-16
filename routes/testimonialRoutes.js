const express = require('express')
const Testimonial = require('../models/Testimonial')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: testimonials })
  } catch (e) { next(e) }
})

module.exports = router
