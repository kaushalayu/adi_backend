const mongoose = require('mongoose')

const whatsappTemplateSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, unique: true },
  category:  { type: String, enum: ['marketing', 'utility', 'authentication'], default: 'marketing' },
  language:  { type: String, default: 'en_US' },
  header:    { type: String, default: '' },
  body:      { type: String, required: true },
  footer:    { type: String, default: '' },
  buttons:   [{ type: String }],
  parameters:[{ name: String, example: String }],
  status:    { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' },
  metaTemplateId: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('WhatsappTemplate', whatsappTemplateSchema)
