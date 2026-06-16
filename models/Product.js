const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
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
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  brand: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    default: null,
  },
  currency: {
    type: String,
    default: '₹',
    trim: true,
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  }],
  colors: [{
    name: { type: String },
    hex: { type: String },
  }],
  sizes: [String],
  tags: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  specifications: [{
    key: { type: String },
    value: { type: String },
  }],
  additionalInfo: {
    type: String,
    trim: true,
    default: '',
  },
  customContent: {
    type: String,
    trim: true,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

productSchema.index({ title: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ featured: 1, createdAt: -1 })

module.exports = mongoose.model('Product', productSchema)
