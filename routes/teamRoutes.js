const express = require('express')
const Team = require('../models/Team')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const members = await Team.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: members })
  } catch (e) { next(e) }
})

module.exports = router
