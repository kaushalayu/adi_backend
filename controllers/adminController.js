const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand')
const Blog = require('../models/Blog')
const FAQ = require('../models/FAQ')
const Contact = require('../models/Contact')
const Newsletter = require('../models/Newsletter')
const Coupon = require('../models/Coupon')
const User = require('../models/User')
const Order = require('../models/Order')
const Review = require('../models/Review')
const Setting = require('../models/Setting')
const Media = require('../models/Media')
const Testimonial = require('../models/Testimonial')
const Team = require('../models/Team')
const Banner = require('../models/Banner')
const BlogComment = require('../models/BlogComment')
const path = require('path')
const fs = require('fs')
const AppError = require('../utils/AppError')

// ============ PRODUCTS ============
const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const filter = {}
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ]
    }
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ])
    res.json({ success: true, data: products, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } })
  } catch (e) { next(e) }
}

const createProduct = async (req, res, next) => {
  try { const product = await Product.create(req.body); res.status(201).json({ success: true, data: product }) }
  catch (e) { next(e) }
}

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) throw new AppError('Product not found', 404)
    res.json({ success: true, data: product })
  } catch (e) { next(e) }
}

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) throw new AppError('Product not found', 404)
    res.json({ success: true, message: 'Product deleted' })
  } catch (e) { next(e) }
}

// ============ CATEGORIES ============
const createCategory = async (req, res, next) => {
  try { const cat = await Category.create(req.body); res.status(201).json({ success: true, data: cat }) }
  catch (e) { next(e) }
}

const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!cat) throw new AppError('Category not found', 404)
    res.json({ success: true, data: cat })
  } catch (e) { next(e) }
}

const deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id)
    if (!cat) throw new AppError('Category not found', 404)
    res.json({ success: true, message: 'Category deleted' })
  } catch (e) { next(e) }
}

// ============ BRANDS ============
const getBrands = async (req, res, next) => {
  try { const brands = await Brand.find().sort({ name: 1 }); res.json({ success: true, data: brands }) }
  catch (e) { next(e) }
}

const createBrand = async (req, res, next) => {
  try { const brand = await Brand.create(req.body); res.status(201).json({ success: true, data: brand }) }
  catch (e) { next(e) }
}

const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!brand) throw new AppError('Brand not found', 404)
    res.json({ success: true, data: brand })
  } catch (e) { next(e) }
}

const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id)
    if (!brand) throw new AppError('Brand not found', 404)
    res.json({ success: true, message: 'Brand deleted' })
  } catch (e) { next(e) }
}

// ============ BLOG ============
const getAllBlogPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const [posts, total] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Blog.countDocuments(),
    ])
    res.json({ success: true, data: posts, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } })
  } catch (e) { next(e) }
}
const createBlogPost = async (req, res, next) => {
  try { const post = await Blog.create(req.body); res.status(201).json({ success: true, data: post }) }
  catch (e) { next(e) }
}

const updateBlogPost = async (req, res, next) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!post) throw new AppError('Blog post not found', 404)
    res.json({ success: true, data: post })
  } catch (e) { next(e) }
}

const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id)
    if (!post) throw new AppError('Blog post not found', 404)
    res.json({ success: true, message: 'Blog post deleted' })
  } catch (e) { next(e) }
}

// ============ FAQS ============
const getAllFAQs = async (req, res, next) => {
  try { const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 }); res.json({ success: true, data: faqs }) }
  catch (e) { next(e) }
}
const createFAQ = async (req, res, next) => {
  try { const faq = await FAQ.create(req.body); res.status(201).json({ success: true, data: faq }) }
  catch (e) { next(e) }
}

const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!faq) throw new AppError('FAQ not found', 404)
    res.json({ success: true, data: faq })
  } catch (e) { next(e) }
}

const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id)
    if (!faq) throw new AppError('FAQ not found', 404)
    res.json({ success: true, message: 'FAQ deleted' })
  } catch (e) { next(e) }
}

// ============ CONTACTS ============
const getContacts = async (req, res, next) => {
  try { const contacts = await Contact.find().sort({ createdAt: -1 }); res.json({ success: true, data: contacts }) }
  catch (e) { next(e) }
}

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!contact) throw new AppError('Contact not found', 404)
    res.json({ success: true, data: contact })
  } catch (e) { next(e) }
}

// ============ NEWSLETTER ============
const getNewsletterSubscribers = async (req, res, next) => {
  try { const subs = await Newsletter.find().sort({ createdAt: -1 }); res.json({ success: true, data: subs }) }
  catch (e) { next(e) }
}

const deleteNewsletterSubscriber = async (req, res, next) => {
  try {
    const sub = await Newsletter.findByIdAndDelete(req.params.id)
    if (!sub) throw new AppError('Subscriber not found', 404)
    res.json({ success: true, message: 'Subscriber deleted' })
  } catch (e) { next(e) }
}

// ============ COUPONS ============
const getCoupons = async (req, res, next) => {
  try { const coupons = await Coupon.find().sort({ createdAt: -1 }); res.json({ success: true, data: coupons }) }
  catch (e) { next(e) }
}

const createCoupon = async (req, res, next) => {
  try { const coupon = await Coupon.create(req.body); res.status(201).json({ success: true, data: coupon }) }
  catch (e) { next(e) }
}

const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!coupon) throw new AppError('Coupon not found', 404)
    res.json({ success: true, data: coupon })
  } catch (e) { next(e) }
}

const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) throw new AppError('Coupon not found', 404)
    res.json({ success: true, message: 'Coupon deleted' })
  } catch (e) { next(e) }
}

// ============ USERS ============
const getUsers = async (req, res, next) => {
  try { const users = await User.find().sort({ createdAt: -1 }); res.json({ success: true, data: users }) }
  catch (e) { next(e) }
}

const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      throw new AppError('Name, email and password are required', 400)
    }
    const existing = await User.findOne({ email })
    if (existing) {
      throw new AppError('Email already in use', 400)
    }
    const user = await User.create({ name, email, password, role: 'admin' })
    res.status(201).json({ success: true, data: user, message: 'Admin user created' })
  } catch (e) { next(e) }
}

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!user) throw new AppError('User not found', 404)
    res.json({ success: true, data: user, message: 'User updated' })
  } catch (e) { next(e) }
}

// ============ ORDERS ============
const getAllOrders = async (req, res, next) => {
  try {
    const { search } = req.query
    const filter = {}
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'billingAddress.email': { $regex: search, $options: 'i' } },
      ]
    }
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (e) { next(e) }
}

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!order) throw new AppError('Order not found', 404)
    res.json({ success: true, data: order })
  } catch (e) { next(e) }
}

// ============ REVIEWS ============
const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))
    const [reviews, total] = await Promise.all([
      Review.find().populate('product', 'title slug').sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Review.countDocuments(),
    ])
    res.json({ success: true, data: reviews, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } })
  } catch (e) { next(e) }
}

const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true })
    if (!review) throw new AppError('Review not found', 404)
    res.json({ success: true, data: review, message: `Review ${req.body.isApproved ? 'approved' : 'unapproved'}` })
  } catch (e) { next(e) }
}

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) throw new AppError('Review not found', 404)
    res.json({ success: true, message: 'Review deleted' })
  } catch (e) { next(e) }
}

// ============ SETTINGS ============
const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne()
    if (!settings) settings = await Setting.create({})
    res.json({ success: true, data: settings })
  } catch (e) { next(e) }
}

const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne()
    if (!settings) settings = await Setting.create(req.body)
    else Object.assign(settings, req.body)
    await settings.save()
    res.json({ success: true, data: settings, message: 'Settings saved' })
  } catch (e) { next(e) }
}

// ============ MEDIA ============
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400)
    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    })
    res.status(201).json({ success: true, data: media })
  } catch (e) { next(e) }
}

const getMedia = async (req, res, next) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 })
    res.json({ success: true, data: media })
  } catch (e) { next(e) }
}

const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)
    if (!media) throw new AppError('Media not found', 404)
    const filePath = path.join(__dirname, '../../uploads', media.filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    await Media.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'File deleted' })
  } catch (e) { next(e) }
}

async function deleteBanner(req, res, next) {
  try { const banner = await Banner.findByIdAndDelete(req.params.id); if (!banner) throw new AppError('Banner not found', 404); res.json({ success: true, message: 'Banner deleted' }) }
  catch (e) { next(e) }
}

// ============ BLOG COMMENTS ============
async function getBlogComments(req, res, next) {
  try {
    const { approved, post } = req.query
    const filter = {}
    if (approved === 'true') filter.isApproved = true
    if (approved === 'false') filter.isApproved = false
    if (post) filter.post = post
    const comments = await BlogComment.find(filter).populate('post', 'title slug').sort({ createdAt: -1 })
    res.json({ success: true, data: comments })
  } catch (e) { next(e) }
}

async function approveBlogComment(req, res, next) {
  try {
    const comment = await BlogComment.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true })
    if (!comment) throw new AppError('Comment not found', 404)
    res.json({ success: true, data: comment, message: 'Comment approved' })
  } catch (e) { next(e) }
}

async function deleteBlogComment(req, res, next) {
  try {
    const comment = await BlogComment.findByIdAndDelete(req.params.id)
    if (!comment) throw new AppError('Comment not found', 404)
    await BlogComment.deleteMany({ parentComment: req.params.id })
    res.json({ success: true, message: 'Comment deleted' })
  } catch (e) { next(e) }
}

// ============ DASHBOARD STATS ============
async function getDashboardStats(req, res, next) {
  try {
    const Product = require('../models/Product')
    const Order = require('../models/Order')
    const User = require('../models/User')
    const Contact = require('../models/Contact')
    const BlogComment = require('../models/BlogComment')

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalProducts, totalOrders, totalUsers, totalContacts,
      pendingOrders, pendingComments,
      todayOrders, weekOrders, monthOrders,
      todayUsers, weekUsers, monthUsers,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Contact.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      BlogComment.countDocuments({ isApproved: false }),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.countDocuments({ createdAt: { $gte: weekStart } }),
      Order.countDocuments({ createdAt: { $gte: monthStart } }),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ createdAt: { $gte: weekStart } }),
      User.countDocuments({ createdAt: { $gte: monthStart } }),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
    ])

    const salesAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const totalSales = salesAgg.length > 0 ? salesAgg[0].total : 0

    const todaySalesAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: todayStart }, orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const todaySales = todaySalesAgg.length > 0 ? todaySalesAgg[0].total : 0

    res.json({
      success: true,
      data: {
        totalProducts, totalOrders, totalUsers, totalContacts, totalSales,
        pendingOrders, pendingComments,
        todaySales, todayOrders,
        weekSales: 0, weekOrders,
        monthSales: 0, monthOrders,
        todayUsers, weekUsers, monthUsers,
        recentOrders,
      },
    })
  } catch (e) { next(e) }
}

module.exports = {
  getAllProducts, createProduct, updateProduct, deleteProduct,
  createCategory, updateCategory, deleteCategory,
  getBrands, createBrand, updateBrand, deleteBrand,
  getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
  getAllFAQs, createFAQ, updateFAQ, deleteFAQ,
  getContacts, updateContact,
  getNewsletterSubscribers, deleteNewsletterSubscriber,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  getUsers, createAdminUser, updateUser,
  getAllOrders, updateOrderStatus,
  getReviews, approveReview, deleteReview,
  getSettings, updateSettings,
  uploadFile, getMedia, deleteMedia,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getTeam, createTeam, updateTeam, deleteTeam,
  getBanners, createBanner, updateBanner, deleteBanner,
  getBlogComments, approveBlogComment, deleteBlogComment,
  getDashboardStats,
}

// ============ TESTIMONIALS ============
async function getTestimonials(req, res, next) {
  try { const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }); res.json({ success: true, data: testimonials }) }
  catch (e) { next(e) }
}
async function createTestimonial(req, res, next) {
  try { const testimonial = await Testimonial.create(req.body); res.status(201).json({ success: true, data: testimonial }) }
  catch (e) { next(e) }
}
async function updateTestimonial(req, res, next) {
  try { const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!testimonial) throw new AppError('Testimonial not found', 404); res.json({ success: true, data: testimonial }) }
  catch (e) { next(e) }
}
async function deleteTestimonial(req, res, next) {
  try { const testimonial = await Testimonial.findByIdAndDelete(req.params.id); if (!testimonial) throw new AppError('Testimonial not found', 404); res.json({ success: true, message: 'Testimonial deleted' }) }
  catch (e) { next(e) }
}

// ============ TEAM ============
async function getTeam(req, res, next) {
  try { const members = await Team.find().sort({ order: 1, createdAt: -1 }); res.json({ success: true, data: members }) }
  catch (e) { next(e) }
}
async function createTeam(req, res, next) {
  try { const member = await Team.create(req.body); res.status(201).json({ success: true, data: member }) }
  catch (e) { next(e) }
}
async function updateTeam(req, res, next) {
  try { const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!member) throw new AppError('Team member not found', 404); res.json({ success: true, data: member }) }
  catch (e) { next(e) }
}
async function deleteTeam(req, res, next) {
  try { const member = await Team.findByIdAndDelete(req.params.id); if (!member) throw new AppError('Team member not found', 404); res.json({ success: true, message: 'Team member deleted' }) }
  catch (e) { next(e) }
}

// ============ BANNERS ============
async function getBanners(req, res, next) {
  try { const banners = await Banner.find().sort({ order: 1, createdAt: -1 }); res.json({ success: true, data: banners }) }
  catch (e) { next(e) }
}
async function createBanner(req, res, next) {
  try { const banner = await Banner.create(req.body); res.status(201).json({ success: true, data: banner }) }
  catch (e) { next(e) }
}
async function updateBanner(req, res, next) {
  try { const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!banner) throw new AppError('Banner not found', 404); res.json({ success: true, data: banner }) }
  catch (e) { next(e) }
}
async function deleteBanner(req, res, next) {
  try { const banner = await Banner.findByIdAndDelete(req.params.id); if (!banner) throw new AppError('Banner not found', 404); res.json({ success: true, message: 'Banner deleted' }) }
  catch (e) { next(e) }
}
