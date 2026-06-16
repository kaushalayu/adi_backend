const FAQ = require('../models/FAQ')
const AppError = require('../utils/AppError')

const getFAQs = async (req, res, next) => {
  try {
    const { category } = req.query
    const filter = { isActive: true }
    if (category) {
      const validCategories = ['shipping', 'payment', 'orders', 'returns', 'general']
      if (!validCategories.includes(category)) {
        throw new AppError(`Invalid category. Valid: ${validCategories.join(', ')}`, 400)
      }
      filter.category = category
    }

    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 })

    res.status(200).json({
      success: true,
      data: faqs,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getFAQs }
