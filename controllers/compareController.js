const Compare = require('../models/Compare')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const getCompare = async (req, res, next) => {
  try {
    let compare = await Compare.findOne({ user: req.user.id })
      .populate('items.product')

    if (!compare) {
      compare = await Compare.create({ user: req.user.id, items: [] })
    }

    res.status(200).json({
      success: true,
      data: compare,
    })
  } catch (error) {
    next(error)
  }
}

const addToCompare = async (req, res, next) => {
  try {
    const { productId } = req.body

    if (!productId) {
      throw new AppError('Product ID is required', 400)
    }

    const product = await Product.findById(productId)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    let compare = await Compare.findOne({ user: req.user.id })
    if (!compare) {
      compare = await Compare.create({ user: req.user.id, items: [] })
    }

    if (compare.items.length >= 4) {
      throw new AppError('You can compare up to 4 products at a time', 400)
    }

    const exists = compare.items.some(
      item => item.product.toString() === productId
    )
    if (exists) {
      throw new AppError('Product already in compare list', 400)
    }

    compare.items.push({ product: productId })
    await compare.save()

    await compare.populate('items.product')

    res.status(200).json({
      success: true,
      data: compare,
      message: 'Added to compare',
    })
  } catch (error) {
    next(error)
  }
}

const removeFromCompare = async (req, res, next) => {
  try {
    const { productId } = req.params

    const compare = await Compare.findOne({ user: req.user.id })
    if (!compare) {
      throw new AppError('Compare list not found', 404)
    }

    compare.items = compare.items.filter(
      item => item.product.toString() !== productId
    )
    await compare.save()

    res.status(200).json({
      success: true,
      data: compare,
      message: 'Removed from compare',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCompare, addToCompare, removeFromCompare }
