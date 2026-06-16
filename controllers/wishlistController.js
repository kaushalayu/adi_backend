const Wishlist = require('../models/Wishlist')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('items.product')

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] })
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    })
  } catch (error) {
    next(error)
  }
}

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body

    if (!productId) {
      throw new AppError('Product ID is required', 400)
    }

    const product = await Product.findById(productId)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] })
    }

    const exists = wishlist.items.some(
      item => item.product.toString() === productId
    )
    if (exists) {
      throw new AppError('Product already in wishlist', 400)
    }

    wishlist.items.push({ product: productId })
    await wishlist.save()

    await wishlist.populate('items.product')

    res.status(200).json({
      success: true,
      data: wishlist,
      message: 'Added to wishlist',
    })
  } catch (error) {
    next(error)
  }
}

const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params

    const wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
      throw new AppError('Wishlist not found', 404)
    }

    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    )
    await wishlist.save()

    res.status(200).json({
      success: true,
      data: wishlist,
      message: 'Removed from wishlist',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist }
