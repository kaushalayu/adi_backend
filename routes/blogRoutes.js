const express = require('express')
const { getPosts, getPost, getBlogCategories, getBlogTags, getRecentPosts } = require('../controllers/blogController')
const commentRoutes = require('./commentRoutes')

const router = express.Router()

router.get('/', getPosts)
router.get('/recent', getRecentPosts)
router.get('/categories', getBlogCategories)
router.get('/tags', getBlogTags)
router.get('/:slug', getPost)
router.use('/:slug/comments', commentRoutes)

module.exports = router
