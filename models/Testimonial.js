const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 200,
    default: '',
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: 1000,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  image: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

module.exports = mongoose.model('Testimonial', testimonialSchema)
