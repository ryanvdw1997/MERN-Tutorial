const mongoose = require('mongoose')

const ercotDALZWestSchema = mongoose.Schema(
  {
    price: {
      type: Number
    },
    time: {
      type: String
    },
    site_label: {
      type: String
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ERCOT_DA_LZWest', ercotDALZWestSchema)