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
const whatsappRoutes = require('./routes/whatsappRoutes')
const portfolioRoutes = require('./routes/portfolioRoutes')

const app = express()
const PORT = process.env.PORT || 5001
const isProd = process.env.NODE_ENV === 'production'
const SITE_URL = 'https://thefurnitureboutique.in'

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

// ── Dynamic Sitemap ──────────────────────────────────────────────────────────
// Generates sitemap.xml with all static pages + live products & blog posts from DB
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Product = require('./models/Product')
    const Blog    = require('./models/Blog')

    const [products, posts] = await Promise.all([
      Product.find({ isActive: { $ne: false } }).select('slug updatedAt').lean(),
      Blog.find({ published: true }).select('slug updatedAt').lean(),
    ])

    const now = new Date().toISOString().slice(0, 10)

    const staticPages = [
      { loc: '/',               changefreq: 'weekly',  priority: '1.0', lastmod: now },
      { loc: '/about',          changefreq: 'monthly', priority: '0.8', lastmod: now },
      { loc: '/shop',           changefreq: 'weekly',  priority: '0.9', lastmod: now },
      { loc: '/blog',           changefreq: 'weekly',  priority: '0.8', lastmod: now },
      { loc: '/contact',        changefreq: 'monthly', priority: '0.7', lastmod: now },
      { loc: '/faq',            changefreq: 'monthly', priority: '0.6', lastmod: now },
      { loc: '/privacy-policy', changefreq: 'yearly',  priority: '0.4', lastmod: now },
    ]

    const productUrls = products
      .filter(p => p.slug)
      .map(p => ({
        loc: `/product/${p.slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : now,
      }))

    const blogUrls = posts
      .filter(p => p.slug)
      .map(p => ({
        loc: `/blog/${p.slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : now,
      }))

    const allUrls = [...staticPages, ...productUrls, ...blogUrls]

    const urlEntries = allUrls.map(u => `
  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, max-age=3600') // 1-hour cache
    res.send(xml)
  } catch (err) {
    res.status(500).send('Error generating sitemap')
  }
})
// ─────────────────────────────────────────────────────────────────────────────

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
app.use('/api/admin/whatsapp', whatsappRoutes)
app.use('/api/portfolio', portfolioRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => {
    if (!isProd) console.log(`Server running on http://localhost:${PORT}`)
  })
})
