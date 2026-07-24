const multer = require('multer')
const path = require('path')
const fs = require('fs')
const AppError = require('../utils/AppError')

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg|ico|bmp|tiff|avif/
  const ext = path.extname(file.originalname).toLowerCase()
  const extOk = allowed.test(ext)
  const mimeOk = file.mimetype.startsWith('image/')
  if (extOk && mimeOk) return cb(null, true)
  cb(new AppError(`File type not allowed: "${file.originalname}". Allowed: jpg, png, gif, webp, svg, bmp, tiff, avif`, 400))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})

module.exports = upload
