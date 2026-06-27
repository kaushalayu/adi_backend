require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')

const Brand = require('./models/Brand')
const FAQ = require('./models/FAQ')
const Category = require('./models/Category')
const Product = require('./models/Product')
const Blog = require('./models/Blog')
const User = require('./models/User')
const Setting = require('./models/Setting')
const Testimonial = require('./models/Testimonial')
const Banner = require('./models/Banner')
const BlogComment = require('./models/BlogComment')

const seed = async () => {
  await connectDB()

  await FAQ.deleteMany({})
  await Category.deleteMany({})
  await Product.deleteMany({})
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Setting.deleteMany({})
  await Brand.deleteMany({})
  await Testimonial.deleteMany({})
  await Banner.deleteMany({})
  await BlogComment.deleteMany({})

  const faqs = await FAQ.insertMany([
    { question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, UPI, Net Banking, and Cash on Delivery.', category: 'payment', order: 1 },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.', category: 'shipping', order: 1 },
    { question: 'What is your return policy?', answer: 'We offer 30-day free returns on all furniture items. Items must be unused and in original packaging.', category: 'returns', order: 1 },
    { question: 'Can I track my order?', answer: 'Yes, you will receive a tracking link via email once your order is shipped.', category: 'orders', order: 1 },
    { question: 'Do you offer assembly services?', answer: 'Yes, we offer professional assembly services for an additional fee. You can select this option at checkout.', category: 'general', order: 1 },
  ])
  console.log(`Seeded ${faqs.length} FAQs`)

  const cat1 = await Category.create({ name: 'Chairs', slug: 'chairs', description: 'Comfortable chairs for your home and office', order: 1 })
  const cat2 = await Category.create({ name: 'Sofas', slug: 'sofas', description: 'Luxury sofas and sofa sets', order: 2 })
  const cat3 = await Category.create({ name: 'Tables', slug: 'tables', description: 'Dining tables, coffee tables & more', order: 3 })
  const cat4 = await Category.create({ name: 'Lamps', slug: 'lamps', description: 'Modern lighting solutions', order: 4 })
  const cat5 = await Category.create({ name: 'Bookshelves', slug: 'bookshelves', description: 'Bookshelves and storage units', order: 5 })
  const cat6 = await Category.create({ name: 'Beds', slug: 'beds', description: 'Premium beds and mattresses for a good night sleep', order: 6 })
  console.log('Seeded 6 categories')

  const products = await Product.insertMany([
    { title: 'Fashion Plastic Chair', slug: 'fashion-plastic-chair', sku: 'CHR-001', description: 'Stylish and durable plastic chair perfect for modern homes.', category: cat1._id, brand: 'Furnico', price: 150, salePrice: 120, currency: '₹', images: [{ url: 'assets/img/product/product1.webp', isPrimary: true }, { url: 'assets/img/product/product2.webp' }], colors: [{ name: 'Red', hex: '#FF0000' }, { name: 'Blue', hex: '#0000FF' }], tags: ['chair', 'plastic', 'modern'], featured: true, inStock: true, stockQuantity: 50 },
    { title: 'Modern Swivel Chair', slug: 'modern-swivel-chair', sku: 'CHR-002', description: 'Ergonomic swivel chair with adjustable height.', category: cat1._id, brand: 'ComfortSeat', price: 160, salePrice: 130, currency: '₹', images: [{ url: 'assets/img/product/product3.webp', isPrimary: true }, { url: 'assets/img/product/product4.webp' }], colors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }], tags: ['chair', 'swivel', 'office'], featured: true, inStock: true, stockQuantity: 30 },
    { title: 'Design Living Sofa', slug: 'design-living-sofa', sku: 'SOF-001', description: 'Elegant 3-seater sofa with premium fabric upholstery.', category: cat2._id, brand: 'LuxuryLiving', price: 155, salePrice: 140, currency: '₹', images: [{ url: 'assets/img/product/product5.webp', isPrimary: true }, { url: 'assets/img/product/product6.webp' }], colors: [{ name: 'Grey', hex: '#808080' }, { name: 'Beige', hex: '#F5F5DC' }], tags: ['sofa', 'living-room', 'modern'], featured: true, inStock: true, stockQuantity: 20 },
    { title: 'Plastic Chair Wooden', slug: 'plastic-chair-wooden', sku: 'CHR-003', description: 'Wooden framed chair with plastic seat for durability.', category: cat1._id, brand: 'WoodCraft', price: 190, salePrice: 170, currency: '₹', images: [{ url: 'assets/img/product/product7.webp', isPrimary: true }, { url: 'assets/img/product/product8.webp' }], colors: [{ name: 'Brown', hex: '#8B4513' }, { name: 'Black', hex: '#000000' }], tags: ['chair', 'wooden', 'classic'], featured: false, inStock: true, stockQuantity: 40 },
    { title: 'Minimalist Table Lamp', slug: 'minimalist-table-lamp', sku: 'LMP-001', description: 'Sleek table lamp with warm LED light.', category: cat4._id, brand: 'LightHouse', price: 85, salePrice: 65, currency: '₹', images: [{ url: 'assets/img/product/product9.webp', isPrimary: true }, { url: 'assets/img/product/product10.webp' }], colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Black', hex: '#000000' }], tags: ['lamp', 'minimalist', 'led'], featured: true, inStock: true, stockQuantity: 100 },
    { title: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair', sku: 'CHR-004', description: 'Premium ergonomic chair with lumbar support.', category: cat1._id, brand: 'ComfortSeat', price: 245, salePrice: 210, currency: '₹', images: [{ url: 'assets/img/product/product1.webp', isPrimary: true }, { url: 'assets/img/product/product2.webp' }], colors: [{ name: 'Black', hex: '#000000' }], tags: ['chair', 'office', 'ergonomic'], featured: true, inStock: true, stockQuantity: 15 },
    { title: 'Wooden Bookshelf', slug: 'wooden-bookshelf', sku: 'BOK-001', description: 'Solid wood bookshelf with 5 shelves.', category: cat5._id, brand: 'WoodCraft', price: 320, salePrice: 280, currency: '₹', images: [{ url: 'assets/img/product/product3.webp', isPrimary: true }, { url: 'assets/img/product/product4.webp' }], colors: [{ name: 'Brown', hex: '#8B4513' }], tags: ['bookshelf', 'wooden', 'storage'], featured: false, inStock: true, stockQuantity: 10 },
    { title: 'Velvet Armchair', slug: 'velvet-armchair', sku: 'CHR-005', description: 'Luxurious velvet armchair with golden legs.', category: cat1._id, brand: 'LuxuryLiving', price: 275, salePrice: 240, currency: '₹', images: [{ url: 'assets/img/product/product5.webp', isPrimary: true }, { url: 'assets/img/product/product6.webp' }], colors: [{ name: 'Green', hex: '#006400' }, { name: 'Blue', hex: '#00008B' }], tags: ['chair', 'velvet', 'luxury'], featured: true, inStock: true, stockQuantity: 25 },
    { title: 'Premium King Size Bed', slug: 'premium-king-size-bed', sku: 'BED-001', description: 'Luxurious king-size bed with solid wood frame and cushioned headboard.', category: cat6._id, brand: 'LuxuryLiving', price: 45000, salePrice: 38999, currency: '₹', images: [{ url: 'assets/img/product/product7.webp', isPrimary: true }, { url: 'assets/img/product/product8.webp' }], colors: [{ name: 'Walnut', hex: '#5C4033' }, { name: 'White', hex: '#FFFFFF' }], tags: ['bed', 'king-size', 'premium'], featured: true, inStock: true, stockQuantity: 10 },
    { title: 'Queen Size Upholstered Bed', slug: 'queen-size-upholstered-bed', sku: 'BED-002', description: 'Elegant queen-size bed with tufted upholstered headboard and wooden frame.', category: cat6._id, brand: 'ComfortSeat', price: 35000, salePrice: 29999, currency: '₹', images: [{ url: 'assets/img/product/product9.webp', isPrimary: true }, { url: 'assets/img/product/product10.webp' }], colors: [{ name: 'Grey', hex: '#808080' }, { name: 'Beige', hex: '#F5F5DC' }], tags: ['bed', 'queen-size', 'upholstered'], featured: true, inStock: true, stockQuantity: 15 },
  ])
  console.log(`Seeded ${products.length} products`)

  const blogs = await Blog.insertMany([
    {
      title: 'Natural Virtual Reality, Feel Your Happiness With VR', slug: 'natural-virtual-reality',
      content: '<p>Virtual reality is transforming how we experience furniture shopping. With VR, you can visualize how a piece of furniture will look in your home before making a purchase.</p><h2>The Future of Furniture Shopping</h2><p>Imagine walking through your living room and seeing exactly how a new sofa would fit. That\'s the power of VR technology.</p>',
      excerpt: 'Virtual reality is transforming how we experience furniture shopping. See how VR can help you find the perfect piece for your home.',
      featuredImage: 'assets/img/blog/blog5.webp', author: 'Admin', category: 'Technology',
      tags: ['VR', 'Technology', 'Furniture'], published: true, publishedAt: new Date('2026-01-15'),
      metaTitle: 'Virtual Reality Furniture Shopping Guide 2026',
      metaDescription: 'Discover how virtual reality is transforming furniture shopping. See how VR can help you find the perfect piece for your home with our comprehensive guide.',
      metaKeywords: 'virtual reality, VR furniture, furniture shopping, VR technology, home design',
      canonicalUrl: 'https://furnitureboutique.com/blog/natural-virtual-reality',
      ogTitle: 'Virtual Reality Furniture Shopping - The Future is Here',
      ogDescription: 'See how VR technology helps you visualize furniture in your home before buying. The future of furniture shopping is here.',
      ogImage: 'assets/img/blog/blog5.webp',
      isFeatured: true,
      schemaMarkup: JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", "headline": "Natural Virtual Reality, Feel Your Happiness With VR", "author": { "@type": "Person", "name": "Admin" }, "datePublished": "2026-01-15" }),
    },
    {
      title: 'Top 10 Interior Design Trends for 2026', slug: 'top-interior-design-trends-2026',
      content: '<p>This year brings fresh and exciting interior design trends that blend comfort with style.</p><h2>Sustainable Materials</h2><p>Eco-friendly furniture made from sustainable materials is taking center stage in 2026.</p>',
      excerpt: 'Discover the top interior design trends of 2026, from sustainable materials to bold colors.',
      featuredImage: 'assets/img/blog/blog-page-big1.webp', author: 'Admin', category: 'Design',
      tags: ['Design', 'Trends', 'Interior'], published: true, publishedAt: new Date('2026-02-20'),
      metaTitle: 'Top 10 Interior Design Trends for 2026 | Furniture Boutique',
      metaDescription: 'Explore the top interior design trends of 2026 including sustainable materials, bold colors, and smart home integration. Transform your living space today.',
      metaKeywords: 'interior design, design trends 2026, home decor, sustainable furniture, interior design trends',
      canonicalUrl: 'https://furnitureboutique.com/blog/top-interior-design-trends-2026',
      ogTitle: '2026 Interior Design Trends You Need to Know',
      ogDescription: 'From sustainable materials to bold colors, discover the interior design trends that will define 2026.',
      ogImage: 'assets/img/blog/blog-page-big1.webp',
    },
    {
      title: 'How to Choose the Perfect Dining Table', slug: 'choose-perfect-dining-table',
      content: '<p>Choosing the right dining table is essential for both functionality and aesthetics.</p><h2>Size Matters</h2><p>Measure your space carefully. Allow at least 90cm around the table for comfortable movement.</p>',
      excerpt: 'A comprehensive guide to finding the perfect dining table for your home and lifestyle.',
      featuredImage: 'assets/img/blog/blog-page-big2.webp', author: 'Admin', category: 'Buying Guide',
      tags: ['Dining', 'Furniture', 'Guide'], published: true, publishedAt: new Date('2026-03-10'),
      metaTitle: 'How to Choose the Perfect Dining Table - Complete Guide',
      metaDescription: 'Learn how to choose the perfect dining table for your home. Our complete guide covers size, shape, material, and style considerations.',
      metaKeywords: 'dining table, choose dining table, dining room furniture, table buying guide, home dining',
      canonicalUrl: 'https://furnitureboutique.com/blog/choose-perfect-dining-table',
      ogTitle: 'Complete Guide: Choosing Your Perfect Dining Table',
      ogDescription: 'Measure, match, and select the ideal dining table. Your complete guide to finding the perfect centerpiece.',
      ogImage: 'assets/img/blog/blog-page-big2.webp',
    },
  ])
  console.log(`Seeded ${blogs.length} blog posts`)

  await Brand.insertMany([
    { name: 'Furnico', slug: 'furnico' },
    { name: 'ComfortSeat', slug: 'comfortseat' },
    { name: 'LuxuryLiving', slug: 'luxuryliving' },
    { name: 'WoodCraft', slug: 'woodcraft' },
    { name: 'LightHouse', slug: 'lighthouse' },
  ])
  console.log('Seeded 5 brands')

  await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL || 'admin@furniture.com', password: process.env.ADMIN_PASSWORD || 'admin123', role: 'admin' })
  console.log(`Created admin user: ${process.env.ADMIN_EMAIL || 'admin@furniture.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`)

  await User.create({ name: 'Test User', email: 'user@test.com', password: 'test123', role: 'customer' })
  console.log('Created test user: user@test.com / test123')

  await Setting.create({
    siteName: 'The Furniture Boutique',
    address: '123 Furniture Street, Lucknow, India',
    email: 'info@furnitureboutique.com',
    phone: '+91 9876543210',
    flatShipping: 50,
    freeShippingThreshold: 500,
    currencySymbol: '₹',
    instagramHandle: '@wooden_furniture_lucknow',
  })
  console.log('Created default settings')

  await Testimonial.insertMany([
    { name: 'Priya Singh', title: 'Interior Designer', content: 'The furniture quality exceeds expectations. Every piece is crafted with precision and care. Highly recommend for anyone looking to upgrade their home.', rating: 5, order: 1 },
    { name: 'Amit Verma', title: 'Homeowner', content: 'Beautiful designs at affordable prices. The delivery was on time and assembly service was professional. Will shop again!', rating: 5, order: 2 },
    { name: 'Neha Patel', title: 'Architect', content: 'Great variety of modern furniture. The customer service team helped me choose the perfect pieces for my project.', rating: 4, order: 3 },
  ])
  console.log('Seeded 3 testimonials')

  await Banner.insertMany([
    { title: 'Premium Furniture Collection', subtitle: 'Transform your home with our handcrafted furniture pieces', description: 'Explore the finest collection in Lucknow. Up to 50% off!', image: 'assets/img/slider/home1-slider1.webp', btnText: 'Shop Now', link: '/shop', type: 'hero', order: 1 },
    { title: 'Summer Sale - Up to 50% Off', subtitle: 'Limited time offer on selected items. Don\'t miss out!', description: 'Handcrafted furniture at unbeatable prices — limited stock!', image: 'assets/img/slider/home1-slider2.webp', btnText: 'View Offers', link: '/shop', type: 'hero', order: 2 },
    { title: 'Single Stylish Mini Chair', image: 'assets/img/banner/banner6.webp', btnText: 'Order Now', link: '/shop', type: 'promo_row_1', order: 1 },
    { title: 'New Furniture Tree Planet', image: 'assets/img/banner/banner7.webp', btnText: 'Order Now', link: '/shop', type: 'promo_row_1', order: 2 },
    { title: 'Luxury Wooden Sofa Set', image: 'assets/img/banner/banner8.webp', btnText: 'Order Now', link: '/shop', type: 'promo_row_1', order: 3 },
    { title: 'Teak Wood Dining Set', image: 'assets/img/banner/banner6.webp', btnText: 'Shop Now', link: '/shop', type: 'promo_row_2', order: 1 },
    { title: 'Handcrafted Bookshelf', image: 'assets/img/banner/banner7.webp', btnText: 'Shop Now', link: '/shop', type: 'promo_row_2', order: 2 },
    { title: 'Modern Study Desk', image: 'assets/img/banner/banner8.webp', btnText: 'Shop Now', link: '/shop', type: 'promo_row_2', order: 3 },
  ])
  console.log('Seeded 8 banners')

  const firstBlog = await Blog.findOne()
  if (firstBlog) {
    await BlogComment.insertMany([
      { post: firstBlog._id, name: 'Rahul Sharma', email: 'rahul@example.com', content: 'Great article! Really helpful for choosing the right furniture for my new home.', isApproved: true },
      { post: firstBlog._id, name: 'Ananya Gupta', email: 'ananya@example.com', website: 'https://ananya.dev', content: 'I have been following your blog for a while. This is one of the best posts yet. Keep up the great work!', isApproved: true },
      { post: firstBlog._id, name: 'Vikram Singh', email: 'vikram@test.com', content: 'Can you suggest some budget-friendly alternatives for these furniture pieces?', isApproved: false },
      { post: firstBlog._id, name: 'Priya Patel', email: 'priya@example.com', content: 'I disagree with some points here. Modern furniture is not always the best choice for Indian homes. Would love to see more traditional options discussed.', isApproved: false },
    ])
    console.log('Seeded 4 blog comments')
  }

  console.log('Seed completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
