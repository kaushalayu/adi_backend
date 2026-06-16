const express = require('express')
const Blog = require('../models/Blog')
const BlogComment = require('../models/BlogComment')
const router = express.Router({ mergeParams: true })

router.get('/', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' })
    const comments = await BlogComment.find({ post: blog._id, isApproved: true, parentComment: null })
      .sort({ createdAt: -1 })
    const replies = await BlogComment.find({ post: blog._id, isApproved: true, parentComment: { $ne: null } })
      .sort({ createdAt: 1 })
    res.json({ success: true, data: { comments, replies } })
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' })
    const comment = await BlogComment.create({ ...req.body, post: blog._id })
    res.status(201).json({ success: true, data: comment, message: 'Comment submitted for approval' })
  } catch (e) { next(e) }
})

module.exports = router
