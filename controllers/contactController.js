const Contact = require('../models/Contact')

const submitContact = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, message, acceptedTerms } = req.body

    const contact = await Contact.create({
      firstName, lastName, email, phone, message, acceptedTerms,
    })

    res.status(201).json({
      success: true,
      data: {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        createdAt: contact.createdAt,
      },
      message: 'Your message has been sent successfully. We will get back to you soon.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { submitContact }
