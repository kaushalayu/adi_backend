const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../../uploads')
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
  const allowed = /jpeg|jpg|png|gif|webp|svg|ico/
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase())
  const mimeOk = allowed.test(file.mimetype.split('/')[1])
  if (extOk && mimeOk) return cb(null, true)
  cb(new Error('Only image files (jpg, png, gif, webp, svg, ico) are allowed'), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = upload
