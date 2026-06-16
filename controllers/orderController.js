const Order = require('../models/Order')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const createOrder = async (req, res, next) => {
  try {
    const { items, billingAddress, shippingAddress, notes, coupon } = req.body

    if (!items || !items.length) {
      throw new AppError('Order must contain at least one item', 400)
    }
    if (!billingAddress) {
      throw new AppError('Billing address is required', 400)
    }

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product).lean()
        if (!product) throw new AppError(`Product ${item.product} not found`, 404)
        return {
          product: item.product,
          title: product.title,
          price: product.salePrice || product.price,
          quantity: item.quantity,
          image: product.images?.[0]?.url || '',
        }
      })
    )

    const subtotal = enrichedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 500 ? 0 : 50
    const discount = 0
    const total = subtotal + shipping - discount

    const orderData = {
      user: req.user ? req.user.id : undefined,
      items: enrichedItems,
      billingAddress: {
        firstName: billingAddress.firstName || '',
        lastName: billingAddress.lastName || '',
        email: billingAddress.email || '',
        phone: billingAddress.phone || '',
        address1: billingAddress.address1 || billingAddress.address || '',
        city: billingAddress.city || '',
        state: billingAddress.state || '',
        postcode: billingAddress.postalCode || billingAddress.postcode || '',
        country: billingAddress.country || 'India',
      },
      shippingAddress: shippingAddress || billingAddress,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      notes: notes || '',
      coupon: coupon || '',
    }

    const order = await Order.create(orderData)

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully',
    })
  } catch (error) {
    next(error)
  }
}

const getOrders = async (req, res, next) => {
  try {
    const filter = {}
    if (req.user) filter.user = req.user.id

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.status(200).json({
      success: true,
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).lean()
    if (!order) {
      throw new AppError('Order not found', 404)
    }

    if (req.user && order.user && order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to view this order', 403)
    }

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

const validateCoupon = async (req, res, next) => {
  try {
    const Coupon = require('../models/Coupon')
    const { code, subtotal } = req.body

    if (!code) {
      throw new AppError('Coupon code is required', 400)
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      $and: [
        { $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gte: new Date() } }] },
      ],
    })

    if (!coupon) {
      throw new AppError('Invalid or expired coupon code', 404)
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError('Coupon usage limit has been reached', 400)
    }

    if (subtotal && subtotal < coupon.minAmount) {
      throw new AppError(`Minimum order amount of ${coupon.minAmount} required for this coupon`, 400)
    }

    let discount = 0
    if (coupon.type === 'percentage') {
      discount = (subtotal || 0) * (coupon.value / 100)
    } else {
      discount = coupon.value
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
      },
      message: 'Coupon applied successfully',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { createOrder, getOrders, getOrder, validateCoupon }
