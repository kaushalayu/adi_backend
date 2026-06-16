require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const Banner = require('./models/Banner')

const fix = async () => {
  await connectDB()
  const banners = await Banner.find({ image: { $in: ['assets/img/slider/slider1.webp', 'assets/img/slider/slider2.webp'] } })
  let count = 0
  for (const banner of banners) {
    const newImage = banner.image === 'assets/img/slider/slider1.webp'
      ? 'assets/img/slider/home1-slider1.webp'
      : 'assets/img/slider/home1-slider2.webp'
    await Banner.findByIdAndUpdate(banner._id, { image: newImage })
    count++
  }
  console.log(`Fixed ${count} banner(s)`)
  process.exit(0)
}

fix().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
