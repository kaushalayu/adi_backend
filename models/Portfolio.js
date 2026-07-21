const mongoose = require('mongoose')

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  category: { type: String, default: 'general' },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Portfolio', portfolioSchema)
