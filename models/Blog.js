const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  featuredImage: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Admin',
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  tags: [String],
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 70,
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160,
  },
  metaKeywords: {
    type: String,
    trim: true,
    maxlength: 255,
  },
  canonicalUrl: {
    type: String,
    trim: true,
  },
  ogImage: {
    type: String,
    default: '',
  },
  ogTitle: {
    type: String,
    trim: true,
    maxlength: 70,
  },
  ogDescription: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  schemaMarkup: {
    type: String,
    trim: true,
  },
  isIndexed: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

blogSchema.index({ published: 1, publishedAt: -1 })
blogSchema.index({ category: 1 })
blogSchema.index({ isFeatured: 1, publishedAt: -1 })

module.exports = mongoose.model('Blog', blogSchema)
