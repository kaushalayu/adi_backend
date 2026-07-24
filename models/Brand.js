const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  logo: {
    type: String,
    default: '',
  },
  logoAlt: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Brand', brandSchema)
