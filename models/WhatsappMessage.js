const mongoose = require('mongoose')

const whatsappMessageSchema = new mongoose.Schema({
  type:       { type: String, enum: ['bulk', 'individual'], required: true },
  recipients: [{ type: String }],   // phone numbers
  template:   { type: String, default: '' },
  message:    { type: String, required: true },
  mediaUrl:   { type: String, default: '' },
  status:     { type: String, enum: ['pending', 'sending', 'done', 'failed'], default: 'pending' },
  sentCount:  { type: Number, default: 0 },
  failCount:  { type: Number, default: 0 },
  results:    [{
    phone:   String,
    status:  { type: String, enum: ['sent', 'failed'] },
    msgId:   String,
    error:   String,
  }],
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  provider: { type: String, enum: ['meta', 'twilio'], default: 'meta' },
}, { timestamps: true })

module.exports = mongoose.model('WhatsappMessage', whatsappMessageSchema)
