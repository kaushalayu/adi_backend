const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { protect, adminOnly } = require('../middleware/auth')
const {
  getContacts,
  addContact,
  deleteContact,
  importCSV,
  getMessages,
  sendMessage,
  sendTemplateMessage,
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  submitTemplate,
  updateTemplateStatus,
  getTags,
  getConfigStatus,
  getWpConfig,
  saveWpConfig,
} = require('../controllers/whatsappController')

const router = express.Router()

router.use(protect, adminOnly)

const csvUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '..', 'uploads')
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      cb(null, dir)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname)
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = /csv|txt|tsv|excel|spreadsheet|ms-excel/
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '')
    const mime = file.mimetype.toLowerCase()
    if (allowed.test(ext) || allowed.test(mime) || mime.startsWith('text/') || mime.includes('sheet') || mime.includes('csv')) {
      return cb(null, true)
    }
    cb(new Error('Only CSV files are allowed'))
  },
  limits: { fileSize: 5 * 1024 * 1024 },
})

router.get('/config-status', getConfigStatus)
router.get('/config', getWpConfig)
router.put('/config', saveWpConfig)

router.get('/contacts', getContacts)
router.post('/contacts', addContact)
router.delete('/contacts/:id', deleteContact)
router.post('/import-csv', csvUpload.single('file'), importCSV)

router.get('/messages', getMessages)
router.post('/send', sendMessage)
router.post('/send-template', sendTemplateMessage)

router.get('/templates', getTemplates)
router.post('/templates', createTemplate)
router.put('/templates/:id', updateTemplate)
router.delete('/templates/:id', deleteTemplate)
router.post('/templates/:id/submit', submitTemplate)
router.put('/templates/:id/status', updateTemplateStatus)

router.get('/tags', getTags)

module.exports = router
