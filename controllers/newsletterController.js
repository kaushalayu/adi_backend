const Newsletter = require('../models/Newsletter')
const { validationResult } = require('express-validator')
const AppError = require('../utils/AppError')

const subscribe = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400,
        errors.array().reduce((acc, err) => {
          acc[err.path] = err.msg
          return acc
        }, {})
      )
    }

    const { email } = req.body

    const existing = await Newsletter.findOne({ email })
    if (existing) {
      if (!existing.subscribed) {
        existing.subscribed = true
        await existing.save()
      }
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter.',
      })
    }

    await Newsletter.create({ email })

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
    })
  } catch (error) {
    next(error)
  }
}

const unsubscribe = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400,
        errors.array().reduce((acc, err) => {
          acc[err.path] = err.msg
          return acc
        }, {})
      )
    }

    const { email } = req.body

    const subscriber = await Newsletter.findOne({ email })
    if (!subscriber) {
      throw new AppError('Email not found in our subscription list.', 404)
    }

    subscriber.subscribed = false
    await subscriber.save()

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed successfully.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { subscribe, unsubscribe }
