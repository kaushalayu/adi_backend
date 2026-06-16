const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 2000,
  },
  acceptedTerms: {
    type: Boolean,
    required: [true, 'You must accept the terms & conditions'],
    validate: {
      validator: (v) => v === true,
      message: 'You must accept the terms & conditions',
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Contact', contactSchema)
