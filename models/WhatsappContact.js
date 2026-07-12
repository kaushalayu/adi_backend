const mongoose = require('mongoose')

const whatsappContactSchema = new mongoose.Schema({
  name:   { type: String, default: '' },
  phone:  { type: String, required: true, trim: true },  // format: 91XXXXXXXXXX (with country code, no +)
  tags:   [{ type: String, trim: true }],
  source: { type: String, default: 'manual' },           // 'manual' | 'csv'
  isActive: { type: Boolean, default: true },
  lastMessageAt: { type: Date, default: null },
  messageCount:  { type: Number, default: 0 },
}, { timestamps: true })

whatsappContactSchema.index({ phone: 1 }, { unique: true })

module.exports = mongoose.model('WhatsappContact', whatsappContactSchema)
