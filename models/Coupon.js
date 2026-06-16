const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: [0, 'Value cannot be negative'],
  },
  minAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  usageLimit: {
    type: Number,
    default: 0,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Coupon', couponSchema)
