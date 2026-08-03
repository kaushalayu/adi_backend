const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
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
  },
  featuredImage: {
    type: String,
    default: '',
  },
  featuredImageAlt: {
    type: String,
    default: '',
    trim: true,
  },
  featuredImageTitle: {
    type: String,
    default: '',
    trim: true,
  },
  featuredImageCaption: {
    type: String,
    default: '',
    trim: true,
  },
  featuredImageDescription: {
    type: String,
    default: '',
    trim: true,
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
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  metaKeywords: {
    type: String,
    trim: true,
    default: '',
  },
  canonicalUrl: {
    type: String,
    trim: true,
  },
  ogImage: {
    type: String,
    default: '',
  },
  ogImageAlt: {
    type: String,
    default: '',
    trim: true,
  },
  ogTitle: {
    type: String,
    trim: true,
  },
  ogDescription: {
    type: String,
    trim: true,
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
