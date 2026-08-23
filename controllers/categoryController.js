const Category = require('../models/Category')
const Product = require('../models/Product')
const AppError = require('../utils/AppError')

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate({ path: 'children', match: { isActive: true } })
      .sort({ order: 1, name: 1 })

    const [byCategory, bySubcategory] = await Promise.all([
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: { isActive: true, subcategory: { $ne: null } } },
        { $group: { _id: '$subcategory', count: { $sum: 1 } } },
      ]),
    ])

    const catCountMap = new Map(byCategory.map(r => [String(r._id), r.count]))
    const subCountMap = new Map(bySubcategory.map(r => [String(r._id), r.count]))

    const topLevel = categories.filter(c => !c.parent)
    const result = topLevel.map(cat => {
      const children = categories
        .filter(c => c.parent && c.parent.toString() === cat._id.toString())
        .map(c => ({ ...c.toJSON(), productCount: subCountMap.get(String(c._id)) || 0 }))
      const childTotal = children.reduce((sum, c) => sum + (c.productCount || 0), 0)

      return {
        ...cat.toJSON(),
        children,
        productCount: (catCountMap.get(String(cat._id)) || 0) + childTotal,
      }
    })

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
