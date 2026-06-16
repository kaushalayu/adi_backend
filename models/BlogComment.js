const mongoose = require('mongoose')

const blogCommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: [true, 'Post ID is required'],
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
  website: {
    type: String,
    trim: true,
    default: '',
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: 2000,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogComment',
    default: null,
  },
}, { timestamps: true })

module.exports = mongoose.model('BlogComment', blogCommentSchema)
