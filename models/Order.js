const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [orderItemSchema],
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    country: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  shippingAddress: {
    firstName: { type: String },
    lastName: { type: String },
    company: { type: String },
    country: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  coupon: { type: String },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'bank_transfer'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: { type: String, trim: true },
}, {
  timestamps: true,
})

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date()
    const prefix = `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)
