const express = require('express')
const Setting = require('../models/Setting')
const AppError = require('../utils/AppError')

const router = express.Router()

// Get public settings (no auth required)
router.get('/', async (req, res, next) => {
  try {
    let settings = await Setting.findOne()
    if (!settings) settings = await Setting.create({})
    res.json({ success: true, data: settings })
  } catch (e) { next(e) }
})

module.exports = router
