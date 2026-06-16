const Review = require('../models/Review')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const reviews = await Review.find({ product: product._id, isApproved: true })
      .sort({ createdAt: -1 })
      .lean()

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
    const averageRating = reviews.length ? Math.round((totalRating / reviews.length) * 10) / 10 : 0

    res.status(200).json({
      success: true,
      data: reviews,
      averageRating,
      totalReviews: reviews.length,
    })
  } catch (error) {
    next(error)
  }
}

const submitReview = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const { name, email, rating, title, content } = req.body

    if (!name || !email || !rating || !content) {
      throw new AppError('Name, email, rating and content are required', 400)
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400)
    }

    const review = await Review.create({
      product: product._id,
      user: req.user ? req.user.id : undefined,
      name,
      email,
      rating,
      title,
      content,
    })

    res.status(201).json({
      success: true,
      data: review,
      message: 'Your review has been submitted and is pending approval.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getProductReviews, submitReview }
