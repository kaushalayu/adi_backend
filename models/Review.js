const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    maxlength: 2000,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

reviewSchema.index({ product: 1, createdAt: -1 })

module.exports = mongoose.model('Review', reviewSchema)
