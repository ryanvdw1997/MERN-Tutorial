const mongoose = require('mongoose')

const bitCoinSchema = mongoose.Schema(
  {
    price: {
      type: Number
    },
    hashRate: {
      type: Number
    },
    supply: {
      type: Number
    },
    marketCap: {
      type: Number
    },
    probWin: {
      type: Number
    },
    avgHashToWin: {
      type: Number
    },
    time: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Bitcoin', bitCoinSchema)