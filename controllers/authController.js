const User = require('../models/User')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  })
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new AppError('Name, email and password are required', 400)
    }

    const existing = await User.findOne({ email })
    if (existing) {
      throw new AppError('An account with this email already exists', 400)
    }

    const user = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      data: { user, token },
      message: 'Account created successfully',
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Email and password are required', 400)
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401)
    }

    const token = signToken(user._id)

    res.status(200).json({
      success: true,
      data: { user, token },
      message: 'Login successful',
    })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (user) {
      const crypto = require('crypto')
      const resetToken = crypto.randomBytes(32).toString('hex')
      user.resetPasswordToken = resetToken
      user.resetPasswordExpires = Date.now() + 3600000
      await user.save()
    }

    res.status(200).json({
      success: true,
      message: 'If that email is registered, a reset link has been sent',
    })
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      throw new AppError('Token and password are required', 400)
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400)
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    })
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      throw new AppError('User not found', 404)
    }
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getMe, forgotPassword, resetPassword }
