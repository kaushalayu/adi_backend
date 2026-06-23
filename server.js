require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

const cartRoutes = require('./routes/cartRoutes')
const accountRoutes = require('./routes/accountRoutes')
const locationRoutes = require('./routes/locationRoutes')
const contactRoutes = require('./routes/contactRoutes')
const newsletterRoutes = require('./routes/newsletterRoutes')
const faqRoutes = require('./routes/faqRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoutes')
const orderRoutes = require('./routes/orderRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const compareRoutes = require('./routes/compareRoutes')
const testimonialRoutes = require('./routes/testimonialRoutes')
const teamRoutes = require('./routes/teamRoutes')
const bannerRoutes = require('./routes/bannerRoutes')
const brandRoutes = require('./routes/brandRoutes')
const adminRoutes = require('./routes/adminRoutes')
const settingsRoutes = require('./routes/settingsRoutes')

const app = express()
const PORT = process.env.PORT || 5001
const isProd = process.env.NODE_ENV === 'production'

const ALLOWED_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') return cb(null, true)
    cb(null, false)
  },
  credentials: true,
}))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() })
})

app.use('/api/cart', cartRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/newsletter', newsletterRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/compare', compareRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/banners', bannerRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => {
    if (!isProd) console.log(`Server running on http://localhost:${PORT}`)
  })
})
