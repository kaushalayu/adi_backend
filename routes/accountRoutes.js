const express = require('express')
const { protect } = require('../middleware/auth')
const { getProfile, updateProfile, changePassword, getAddresses, updateAddresses } = require('../controllers/accountController')

const router = express.Router()

router.use(protect)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.post('/change-password', changePassword)
router.get('/addresses', getAddresses)
router.put('/addresses', updateAddresses)

module.exports = router
