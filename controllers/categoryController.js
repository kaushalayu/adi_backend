const Category = require('../models/Category')
const AppError = require('../utils/AppError')

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate({ path: 'children', match: { isActive: true } })
      .sort({ order: 1, name: 1 })

    const topLevel = categories.filter(c => !c.parent)
    const result = topLevel.map(cat => ({
      ...cat.toJSON(),
      children: categories.filter(c => c.parent && c.parent.toString() === cat._id.toString()),
    }))

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const getCategory = async (req, res, next) => {
  try {
    const isValidObjectId = req.params.slug.match(/^[0-9a-fA-F]{24}$/)
    const query = isValidObjectId
      ? { _id: req.params.slug, isActive: true }
      : { slug: req.params.slug, isActive: true }
    const category = await Category.findOne(query)
      .populate({ path: 'children', match: { isActive: true } })

    if (!category) {
      throw new AppError('Category not found', 404)
    }

    res.status(200).json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCategories, getCategory }
