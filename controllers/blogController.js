const Blog = require('../models/Blog')
const AppError = require('../utils/AppError')

const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, category, tag, search } = req.query

    const filter = { published: true, publishedAt: { $lte: new Date() } }
    if (category) filter.category = category
    if (tag) filter.tags = tag
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]
    }

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 6))
    const skip = (pageNum - 1) * limitNum

    const [posts, total] = await Promise.all([
      Blog.find(filter)
        .select('-content -schemaMarkup')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blog.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      data: posts,
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

const getPost = async (req, res, next) => {
  try {
    const post = await Blog.findOne({
      slug: req.params.slug,
      published: true,
      publishedAt: { $lte: new Date() },
    })

    if (!post) {
      throw new AppError('Blog post not found', 404)
    }

    const recent = await Blog.find({
      _id: { $ne: post._id },
      published: true,
    })
      .select('title slug featuredImage excerpt publishedAt')
      .sort({ publishedAt: -1 })
      .limit(4)
      .lean()

    res.status(200).json({
      success: true,
      data: post,
      recentPosts: recent,
    })
  } catch (error) {
    next(error)
  }
}

const getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', { published: true })
    res.status(200).json({ success: true, data: categories })
  } catch (error) {
    next(error)
  }
}

const getBlogTags = async (req, res, next) => {
  try {
    const posts = await Blog.find({ published: true }).select('tags').lean()
    const tags = [...new Set(posts.flatMap(p => p.tags || []))].sort()
    res.status(200).json({ success: true, data: tags })
  } catch (error) {
    next(error)
  }
}

const getRecentPosts = async (req, res, next) => {
  try {
    const posts = await Blog.find({
      published: true,
      publishedAt: { $lte: new Date() },
    })
      .select('title slug featuredImage excerpt publishedAt')
      .sort({ publishedAt: -1 })
      .limit(4)
      .lean()

    res.status(200).json({ success: true, data: posts })
  } catch (error) {
    next(error)
  }
}

module.exports = { getPosts, getPost, getBlogCategories, getBlogTags, getRecentPosts }
