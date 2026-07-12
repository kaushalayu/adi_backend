const axios       = require('axios')
const twilio      = require('twilio')
const { parse }   = require('csv-parse/sync')
const fs          = require('fs')
const WhatsappContact = require('../models/WhatsappContact')
const WhatsappMessage = require('../models/WhatsappMessage')
const WhatsappTemplate = require('../models/WhatsappTemplate')
const Setting = require('../models/Setting')
const AppError    = require('../utils/AppError')

// ── helpers ──────────────────────────────────────────────────────────────────

const WA_BASE = 'https://graph.facebook.com/v19.0'

let twilioClient = null

/** Load WhatsApp config from DB (Setting singleton) */
async function loadWpConfig() {
  let settings = await Setting.findOne()
  if (!settings) settings = await Setting.create({})
  return {
    provider: settings.whatsappProvider || 'meta',
    metaPhoneId: settings.metaPhoneId || '',
    metaToken: settings.metaToken || '',
    twilioSid: settings.twilioSid || '',
    twilioToken: settings.twilioToken || '',
    twilioFrom: settings.twilioFrom || 'whatsapp:+14155238886',
  }
}

function getTwilioClient(sid, token) {
  if (sid && token) return twilio(sid, token)
  return null
}

function normalisePhone(raw) {
  return String(raw || '').replace(/\D/g, '')
}

function formatForTwilio(raw) {
  const digits = normalisePhone(raw)
  return `whatsapp:+${digits}`
}

// ── Send functions ───────────────────────────────────────────────────────────

async function sendMetaMessage(to, bodyText, phoneId, token) {
  const url = `${WA_BASE}/${phoneId}/messages`
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { preview_url: false, body: bodyText },
  }
  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  return res.data?.messages?.[0]?.id || 'ok'
}

async function sendMetaTemplate(to, templateName, languageCode, params, phoneId, token) {
  const url = `${WA_BASE}/${phoneId}/messages`
  const components = []
  if (params?.length > 0) {
    components.push({ type: 'body', parameters: params.map(p => ({ type: 'text', text: p })) })
  }
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components.length > 0 ? { components } : {}),
    },
  }
  const res = await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  return res.data?.messages?.[0]?.id || 'ok'
}

async function sendTwilioMessage(to, bodyText, from, client) {
  const msg = await client.messages.create({
    from,
    to: formatForTwilio(to),
    body: bodyText,
  })
  return msg.sid
}

async function sendTwilioTemplate(to, templateName, params, from, client) {
  const contentVars = {}
  if (params?.length > 0) {
    params.forEach((p, i) => { contentVars[`${i + 1}`] = p })
  }
  const msg = await client.messages.create({
    from,
    to: formatForTwilio(to),
    contentSid: templateName,
    contentVariables: JSON.stringify(contentVars),
  })
  return msg.sid
}

/** Unified send */
async function sendByProvider(cfg, to, message, templateData) {
  if (cfg.provider === 'twilio') {
    const client = getTwilioClient(cfg.twilioSid, cfg.twilioToken)
    if (!client) throw new AppError('Twilio credentials invalid', 503)
    if (templateData) return await sendTwilioTemplate(to, templateData.name, templateData.params, cfg.twilioFrom, client)
    return await sendTwilioMessage(to, message, cfg.twilioFrom, client)
  }
  // Meta
  if (!cfg.metaPhoneId || !cfg.metaToken) throw new AppError('Meta WhatsApp credentials not set', 503)
  if (templateData) return await sendMetaTemplate(to, templateData.name, templateData.language, templateData.params, cfg.metaPhoneId, cfg.metaToken)
  return await sendMetaMessage(to, message, cfg.metaPhoneId, cfg.metaToken)
}

// ── Contacts ─────────────────────────────────────────────────────────────────

exports.getContacts = async (req, res, next) => {
  try {
    const { search, tag, page = 1, limit = 50 } = req.query
    const filter = {}
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ]
    if (tag) filter.tags = tag

    const total    = await WhatsappContact.countDocuments(filter)
    const contacts = await WhatsappContact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, data: contacts, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } })
  } catch (e) { next(e) }
}

exports.addContact = async (req, res, next) => {
  try {
    const { name, phone, tags } = req.body
    const p = normalisePhone(phone)
    if (!p || p.length < 10) throw new AppError('Invalid phone number', 400)

    const contact = await WhatsappContact.findOneAndUpdate(
      { phone: p },
      { name: name || '', tags: tags || [], source: 'manual', isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    res.status(201).json({ success: true, data: contact })
  } catch (e) { next(e) }
}

exports.deleteContact = async (req, res, next) => {
  try {
    await WhatsappContact.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (e) { next(e) }
}

exports.importCSV = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400)

    const raw = fs.readFileSync(req.file.path, 'utf-8')
    fs.unlinkSync(req.file.path)

    const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true })

    let imported = 0, skipped = 0
    for (const row of rows) {
      const rawPhone = row.phone || row.Phone || row.mobile || row.Mobile || row.number || row.Number || ''
      const name     = row.name  || row.Name  || row.NAME  || ''
      const phone    = normalisePhone(rawPhone)
      if (!phone || phone.length < 10) { skipped++; continue }

      try {
        await WhatsappContact.findOneAndUpdate(
          { phone },
          { name, source: 'csv', isActive: true },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        imported++
      } catch { skipped++ }
    }

    res.json({ success: true, imported, skipped, total: rows.length })
  } catch (e) { next(e) }
}

// ── Messages ─────────────────────────────────────────────────────────────────

exports.getMessages = async (req, res, next) => {
  try {
    const msgs = await WhatsappMessage.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('sentBy', 'name email')
    res.json({ success: true, data: msgs })
  } catch (e) { next(e) }
}

/** POST /api/admin/whatsapp/send */
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, recipients, tag, provider } = req.body
    if (!message?.trim()) throw new AppError('Message text required', 400)

    const cfg = await loadWpConfig()
    const useProvider = provider || cfg.provider

    let phones = []
    if (recipients === 'all') {
      const all = await WhatsappContact.find({ isActive: true }).select('phone')
      phones = all.map(c => c.phone)
    } else if (tag) {
      const tagged = await WhatsappContact.find({ isActive: true, tags: tag }).select('phone')
      phones = tagged.map(c => c.phone)
    } else if (Array.isArray(recipients)) {
      phones = recipients.map(normalisePhone).filter(p => p.length >= 10)
    } else {
      throw new AppError('Provide recipients: "all" | array of phones | tag', 400)
    }

    if (phones.length === 0) throw new AppError('No recipients found', 400)

    const log = await WhatsappMessage.create({
      type: phones.length === 1 ? 'individual' : 'bulk',
      recipients: phones,
      message,
      status: 'sending',
      sentBy: req.user._id !== 'admin' ? req.user._id : undefined,
      provider: useProvider,
    })

    const sendCfg = { ...cfg, provider: useProvider }
    const results = []
    let sentCount = 0, failCount = 0

    for (const phone of phones) {
      try {
        const msgId = await sendByProvider(sendCfg, phone, message)
        results.push({ phone, status: 'sent', msgId })
        sentCount++
        await WhatsappContact.findOneAndUpdate({ phone }, {
          $inc: { messageCount: 1 },
          lastMessageAt: new Date(),
        })
      } catch (err) {
        const errorMsg = err.response?.data?.error?.message || err.message || String(err)
        results.push({ phone, status: 'failed', error: errorMsg })
        failCount++
      }
    }

    await WhatsappMessage.findByIdAndUpdate(log._id, {
      status: failCount === phones.length ? 'failed' : 'done',
      sentCount, failCount, results,
    })

    res.json({ success: true, sentCount, failCount, total: phones.length, logId: log._id, provider: useProvider })
  } catch (e) { next(e) }
}

/** POST /api/admin/whatsapp/send-template */
exports.sendTemplateMessage = async (req, res, next) => {
  try {
    const { templateId, params, recipients, tag, provider } = req.body

    if (!templateId) throw new AppError('Template ID required', 400)

    const cfg = await loadWpConfig()
    const useProvider = provider || cfg.provider

    const template = await WhatsappTemplate.findById(templateId)
    if (!template) throw new AppError('Template not found', 404)
    if (template.status !== 'approved') throw new AppError(`Template is ${template.status}. Only approved templates can be sent.`, 400)

    let phones = []
    if (recipients === 'all') {
      const all = await WhatsappContact.find({ isActive: true }).select('phone')
      phones = all.map(c => c.phone)
    } else if (tag) {
      const tagged = await WhatsappContact.find({ isActive: true, tags: tag }).select('phone')
      phones = tagged.map(c => c.phone)
    } else if (Array.isArray(recipients)) {
      phones = recipients.map(normalisePhone).filter(p => p.length >= 10)
    } else {
      throw new AppError('Provide recipients: "all" | array of phones | tag', 400)
    }

    if (phones.length === 0) throw new AppError('No recipients found', 400)

    const log = await WhatsappMessage.create({
      type: phones.length === 1 ? 'individual' : 'bulk',
      recipients: phones,
      message: `[Template: ${template.name}] ${template.body}`,
      status: 'sending',
      sentBy: req.user._id !== 'admin' ? req.user._id : undefined,
      provider: useProvider,
    })

    const sendCfg = { ...cfg, provider: useProvider }
    const results = []
    let sentCount = 0, failCount = 0

    for (const phone of phones) {
      try {
        const templateData = { name: template.name, language: template.language, params: params || [] }
        const msgId = await sendByProvider(sendCfg, phone, null, templateData)
        results.push({ phone, status: 'sent', msgId })
        sentCount++
        await WhatsappContact.findOneAndUpdate({ phone }, {
          $inc: { messageCount: 1 },
          lastMessageAt: new Date(),
        })
      } catch (err) {
        const errorMsg = err.response?.data?.error?.message || err.message || String(err)
        results.push({ phone, status: 'failed', error: errorMsg })
        failCount++
      }
    }

    await WhatsappMessage.findByIdAndUpdate(log._id, {
      status: failCount === phones.length ? 'failed' : 'done',
      sentCount, failCount, results,
    })

    res.json({ success: true, sentCount, failCount, total: phones.length, logId: log._id, provider: useProvider })
  } catch (e) { next(e) }
}

// ── Templates ────────────────────────────────────────────────────────────────

exports.getTemplates = async (req, res, next) => {
  try {
    const templates = await WhatsappTemplate.find().sort({ createdAt: -1 })
    res.json({ success: true, data: templates })
  } catch (e) { next(e) }
}

exports.createTemplate = async (req, res, next) => {
  try {
    const { name, category, language, header, body, footer, buttons, parameters } = req.body
    if (!name?.trim() || !body?.trim()) throw new AppError('Name and body are required', 400)

    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
    const existing = await WhatsappTemplate.findOne({ name: cleanName })
    if (existing) throw new AppError('Template with this name already exists', 400)

    const template = await WhatsappTemplate.create({
      name: cleanName,
      category: category || 'marketing',
      language: language || 'en_US',
      header: header || '',
      body: body.trim(),
      footer: footer || '',
      buttons: buttons || [],
      parameters: parameters || [],
      status: 'draft',
    })

    res.status(201).json({ success: true, data: template })
  } catch (e) { next(e) }
}

exports.updateTemplate = async (req, res, next) => {
  try {
    const { header, body, footer, buttons, parameters, category, language } = req.body
    const template = await WhatsappTemplate.findByIdAndUpdate(
      req.params.id,
      { header, body, footer, buttons, parameters, category, language, status: 'draft' },
      { new: true }
    )
    if (!template) throw new AppError('Template not found', 404)
    res.json({ success: true, data: template })
  } catch (e) { next(e) }
}

exports.deleteTemplate = async (req, res, next) => {
  try {
    await WhatsappTemplate.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (e) { next(e) }
}

exports.submitTemplate = async (req, res, next) => {
  try {
    const template = await WhatsappTemplate.findById(req.params.id)
    if (!template) throw new AppError('Template not found', 404)
    if (template.status === 'approved') throw new AppError('Template already approved', 400)
    template.status = 'pending'
    await template.save()
    res.json({ success: true, data: template, message: 'Template submitted for review.' })
  } catch (e) { next(e) }
}

exports.updateTemplateStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body
    if (!['draft', 'pending', 'approved', 'rejected'].includes(status)) throw new AppError('Invalid status', 400)
    const template = await WhatsappTemplate.findByIdAndUpdate(req.params.id, { status, rejectionReason: rejectionReason || '' }, { new: true })
    if (!template) throw new AppError('Template not found', 404)
    res.json({ success: true, data: template })
  } catch (e) { next(e) }
}

// ── Utility ──────────────────────────────────────────────────────────────────

exports.getTags = async (req, res, next) => {
  try {
    const tags = await WhatsappContact.distinct('tags')
    res.json({ success: true, data: tags.filter(Boolean) })
  } catch (e) { next(e) }
}

/** GET /api/admin/whatsapp/config-status — both providers from DB */
exports.getConfigStatus = async (req, res, next) => {
  try {
    const cfg = await loadWpConfig()
    const metaConfigured = !!(cfg.metaToken && cfg.metaPhoneId)
    const twilioConfigured = !!(cfg.twilioSid && cfg.twilioToken)

    res.json({
      success: true,
      provider: cfg.provider,
      meta: {
        configured: metaConfigured,
        phoneId: cfg.metaPhoneId ? 'set' : 'not set',
        token: cfg.metaToken ? 'set' : 'not set',
      },
      twilio: {
        configured: twilioConfigured,
        accountSid: cfg.twilioSid ? 'set' : 'not set',
        authToken: cfg.twilioToken ? 'set' : 'not set',
        from: cfg.twilioFrom,
      },
      configured: metaConfigured || twilioConfigured,
    })
  } catch (e) { next(e) }
}

/** GET /api/admin/whatsapp/config — full config for editing */
exports.getWpConfig = async (req, res, next) => {
  try {
    const cfg = await loadWpConfig()
    res.json({ success: true, data: cfg })
  } catch (e) { next(e) }
}

/** PUT /api/admin/whatsapp/config — save config */
exports.saveWpConfig = async (req, res, next) => {
  try {
    const { whatsappProvider, metaPhoneId, metaToken, twilioSid, twilioToken, twilioFrom } = req.body
    let settings = await Setting.findOne()
    if (!settings) settings = await Setting.create({})

    if (whatsappProvider !== undefined) settings.whatsappProvider = whatsappProvider
    if (metaPhoneId !== undefined) settings.metaPhoneId = metaPhoneId
    if (metaToken !== undefined) settings.metaToken = metaToken
    if (twilioSid !== undefined) settings.twilioSid = twilioSid
    if (twilioToken !== undefined) settings.twilioToken = twilioToken
    if (twilioFrom !== undefined) settings.twilioFrom = twilioFrom

    await settings.save()
    res.json({ success: true, message: 'WhatsApp config saved' })
  } catch (e) { next(e) }
}
