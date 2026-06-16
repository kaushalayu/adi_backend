const AppError = require('../utils/AppError')

const getCountries = async (req, res, next) => {
  try {
    const countries = [
      {
        name: 'India',
        code: 'IN',
        states: [
          'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
          'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
          'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
          'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
          'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
          'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
          'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
          'West Bengal',
        ],
      },
    ]

    res.status(200).json({ success: true, data: { countries } })
  } catch (error) {
    next(error)
  }
}

module.exports = { getCountries }
