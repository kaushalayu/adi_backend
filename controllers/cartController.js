const Cart = require('../models/Cart')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    next(error)
  }
}

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      throw new AppError('Product ID is required', 400)
    }

    const product = await Product.findById(productId)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({
        product: productId,
        quantity,
        title: product.title,
        price: product.salePrice || product.price,
        image: product.images && product.images.length > 0 ? product.images[0].url : '',
      })
    }

    await cart.save()
    await cart.populate('items.product')

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Item added to cart',
    })
  } catch (error) {
    next(error)
  }
}

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400)
    }

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      throw new AppError('Cart not found', 404)
    }

    const item = cart.items.id(req.params.itemId)
    if (!item) {
      throw new AppError('Item not found in cart', 404)
    }

    item.quantity = quantity
    await cart.save()
    await cart.populate('items.product')

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart updated',
    })
  } catch (error) {
    next(error)
  }
}

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      throw new AppError('Cart not found', 404)
    }

    const item = cart.items.id(req.params.itemId)
    if (!item) {
      throw new AppError('Item not found in cart', 404)
    }

    item.deleteOne()
    await cart.save()
    await cart.populate('items.product')

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Item removed from cart',
    })
  } catch (error) {
    next(error)
  }
}

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      throw new AppError('Cart not found', 404)
    }

    cart.items = []
    await cart.save()

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Cart cleared',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
