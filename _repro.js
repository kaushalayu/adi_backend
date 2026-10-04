require('dotenv').config()
const fs = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/Blog')
const { getAllBlogPosts } = require('./controllers/adminController')

const docs = JSON.parse(fs.readFileSync('C:/Users/kaush/AppData/Local/Temp/opencode/blog-docs.json', 'utf8').replace(/^\uFEFF/, ''))

const toDoc = (d) => {
  const out = {}
  for (const [k, v] of Object.entries(d)) {
    if (k === '_id') { out._id = new mongoose.Types.ObjectId(v); continue }
    if (k === 'publishedAt' || k === 'createdAt' || k === 'updatedAt') { out[k] = v ? new Date(v) : null; continue }
    out[k] = v
  }
  return out
}

;(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  const existing = await Blog.find({ slug: /^real-test-/ }).select('_id').lean()
  await Blog.deleteMany({ _id: { $in: existing.map(d => d._id) } })
  const saved = await Blog.insertMany(docs.map((d, i) => ({ ...toDoc(d), slug: `real-test-${i}-${d._id}` })))
  console.log('inserted real docs:', saved.length)

  const app = express()
  app.get('/admin/blog', getAllBlogPosts)
  app.use((err, req, res, next) => {
    console.log('\n>>> ERROR:', err.name, '|', err.message)
    console.log(err.stack.split('\n').slice(0, 5).join('\n'))
    res.status(500).json({ success: false, message: 'Internal server error' })
  })
  const server = app.listen(5099)
  const http = require('http')
  const call = (q) => new Promise((resolve) => {
    http.get({ host: '127.0.0.1', port: 5099, path: q }, (r) => {
      let b = ''
      r.on('data', (c) => (b += c))
      r.on('end', () => resolve({ status: r.statusCode, len: b.length }))
    })
  })
  for (const l of [6, 7, 10, 50]) {
    console.log(`--- limit=${l} ->`, JSON.stringify(await call(`/admin/blog?page=1&limit=${l}`)))
  }
  for (const [p, l] of [[3, 1], [4, 1], [4, 2], [2, 3], [3, 2]]) {
    console.log(`--- page=${p}&limit=${l} ->`, JSON.stringify(await call(`/admin/blog?page=${p}&limit=${l}`)))
  }
  server.close()
  const del = await Blog.find({ slug: /^real-test-/ }).select('_id').lean()
  await Blog.deleteMany({ _id: { $in: del.map(d => d._id) } })
  console.log('cleanup done, remaining =', await Blog.countDocuments())
  await mongoose.disconnect()
  process.exit(0)
})()