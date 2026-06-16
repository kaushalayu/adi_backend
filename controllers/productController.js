const Product = require('../models/Product')
const Category = require('../models/Category')
const AppError = require('../utils/AppError')

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      color,
      featured,
      sort = '-createdAt',
    } = req.query

    const filter = { isActive: true }

    if (category) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(category)
      if (isObjectId) {
        filter.category = category
      } else {
        const cat = await Category.findOne({ slug: category }).select('_id').lean()
        if (cat) filter.category = cat._id
        else return res.status(200).json({ success: true, data: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } })
      }
    }
    if (brand) filter.brand = brand
    if (featured === 'true') filter.featured = true
    if (color) filter['colors.name'] = { $regex: color, $options: 'i' }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ]
    }

    let sortOption = {}
    switch (sort) {
      case 'price_asc': sortOption = { salePrice: 1, price: 1 }; break
      case 'price_desc': sortOption = { salePrice: -1, price: -1 }; break
      case 'name_asc': sortOption = { title: 1 }; break
      case 'name_desc': sortOption = { title: -1 }; break
      case 'newest': sortOption = { createdAt: -1 }; break
      default: sortOption = { createdAt: -1 }
    }

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12))
    const skip = (pageNum - 1) * limitNum

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    next(error)
  }
}

const getProduct = async (req, res, next) => {
  try {
    const isMongoId = req.params.slug.match(/^[0-9a-fA-F]{24}$/)
    const query = isMongoId ? { _id: req.params.slug, isActive: true } : { slug: req.params.slug, isActive: true }
    const product = await Product.findOne(query).populate('category', 'name slug')

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    res.status(200).json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean()
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(4)
      .lean()

    res.status(200).json({
      success: true,
      data: related,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getProducts, getProduct, getRelatedProducts }
