const mongoose = require('mongoose')

const ercotRTHubSchema = mongoose.Schema(
  {
    price: {
      type: Number
    },
    time: {
      type: String
    },
    site_label: {
      type: String
    },
    tries: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ERCOT_RT_Hub', ercotRTHubSchema)