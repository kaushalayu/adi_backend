const mongoose = require('mongoose')

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['shipping', 'payment', 'orders', 'returns', 'general'],
    default: 'general',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('FAQ', faqSchema)
