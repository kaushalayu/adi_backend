const User = require('../models/User')
const AppError = require('../utils/AppError')

const getProfile = async (req, res, next) => {
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

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body
    const updates = {}
    if (name) updates.name = name
    if (phone) updates.phone = phone
    if (email) updates.email = email

    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } })
      if (existing) {
        throw new AppError('Email already in use', 400)
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({ success: true, data: user, message: 'Profile updated' })
  } catch (error) {
    next(error)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400)
    }

    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400)
    }

    const user = await User.findById(req.user.id).select('+password')
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401)
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}

const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      throw new AppError('User not found', 404)
    }
    res.status(200).json({ success: true, data: user.addresses || [] })
  } catch (error) {
    next(error)
  }
}

const updateAddresses = async (req, res, next) => {
  try {
    const { addresses } = req.body

    if (!Array.isArray(addresses)) {
      throw new AppError('Addresses must be an array', 400)
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { addresses },
      { new: true, runValidators: true }
    )
    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.status(200).json({ success: true, data: user.addresses, message: 'Addresses updated' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getProfile, updateProfile, changePassword, getAddresses, updateAddresses }
