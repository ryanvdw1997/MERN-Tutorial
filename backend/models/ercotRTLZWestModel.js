const mongoose = require('mongoose')

const ercotRTLZWestSchema = mongoose.Schema(
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

module.exports = mongoose.model('ERCOT_RT_LZWest', ercotRTLZWestSchema)