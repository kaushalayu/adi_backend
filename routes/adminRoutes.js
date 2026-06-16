const express = require('express')
const { protect, adminOnly } = require('../middleware/auth')
const upload = require('../middleware/upload')
const { getCategories } = require('../controllers/categoryController')
const {
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
} = require('../controllers/adminController')

const router = express.Router()

router.use(protect, adminOnly)

// Products
router.get('/products', getAllProducts)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

// Categories
router.get('/categories', getCategories)
router.post('/categories', createCategory)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

// Brands
router.get('/brands', getBrands)
router.post('/brands', createBrand)
router.put('/brands/:id', updateBrand)
router.delete('/brands/:id', deleteBrand)

// Blog
router.get('/blog', getAllBlogPosts)
router.post('/blog', createBlogPost)
router.put('/blog/:id', updateBlogPost)
router.delete('/blog/:id', deleteBlogPost)

// FAQs
router.get('/faq', getAllFAQs)
router.post('/faq', createFAQ)
router.put('/faq/:id', updateFAQ)
router.delete('/faq/:id', deleteFAQ)

// Contacts
router.get('/contact', getContacts)
router.put('/contact/:id', updateContact)

// Newsletter
router.get('/newsletter', getNewsletterSubscribers)
router.delete('/newsletter/:id', deleteNewsletterSubscriber)

// Coupons
router.get('/coupons', getCoupons)
router.post('/coupons', createCoupon)
router.put('/coupons/:id', updateCoupon)
router.delete('/coupons/:id', deleteCoupon)

// Users
router.get('/users', getUsers)
router.post('/users', createAdminUser)
router.put('/users/:id', updateUser)

// Orders
router.get('/orders', getAllOrders)
router.put('/orders/:id', updateOrderStatus)

// Reviews
router.get('/reviews', getReviews)
router.put('/reviews/:id', approveReview)
router.delete('/reviews/:id', deleteReview)

// Settings
router.get('/settings', getSettings)
router.put('/settings', updateSettings)

// Media
router.get('/media', getMedia)
router.post('/media/upload', upload.single('file'), uploadFile)
router.delete('/media/:id', deleteMedia)

// Testimonials
router.get('/testimonials', getTestimonials)
router.post('/testimonials', createTestimonial)
router.put('/testimonials/:id', updateTestimonial)
router.delete('/testimonials/:id', deleteTestimonial)

// Team
router.get('/team', getTeam)
router.post('/team', createTeam)
router.put('/team/:id', updateTeam)
router.delete('/team/:id', deleteTeam)

// Banners
router.get('/banners', getBanners)
router.post('/banners', createBanner)
router.put('/banners/:id', updateBanner)
router.delete('/banners/:id', deleteBanner)

// Blog Comments
router.get('/blog-comments', getBlogComments)
router.put('/blog-comments/:id/approve', approveBlogComment)
router.delete('/blog-comments/:id', deleteBlogComment)

// Dashboard
router.get('/dashboard/stats', getDashboardStats)

module.exports = router
