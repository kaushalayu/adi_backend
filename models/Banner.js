const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200,
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  link: {
    type: String,
    default: '',
  },
  btnText: {
    type: String,
    default: 'Shop Now',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

module.exports = mongoose.model('Banner', bannerSchema)
