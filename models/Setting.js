const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'The Furniture Boutique' },
  siteLogo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  address: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  skype: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  flatShipping: { type: Number, default: 50 },
  freeShippingThreshold: { type: Number, default: 500 },
  currencySymbol: { type: String, default: '₹' },
  taxRate: { type: Number, default: 0 },
  // Deal of the week timer
  dealEndDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  dealTitle: { type: String, default: 'Teakwood Dining Showcase' },
  dealDesc: { type: String, default: 'Premium Teakwood Dining set — high durability, hand-varnished polish, custom upholstery options.' },
  dealImage: { type: String, default: '' },
  // Video banner URL (e.g., YouTube/Vimeo link or MP4)
  bannerVideoUrl: { type: String, default: '' },
  // Instagram posts (array of image+url)
  instagramPosts: [{
    image: { type: String },
    url:   { type: String },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Setting', settingSchema)
