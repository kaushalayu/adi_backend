const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
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
  image: {
    type: String,
    default: '',
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    skype: { type: String, default: '' },
    youtube: { type: String, default: '' },
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

module.exports = mongoose.model('Team', teamSchema)
