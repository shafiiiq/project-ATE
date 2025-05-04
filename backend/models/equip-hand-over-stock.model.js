const mongoose = require('mongoose');

const counterWeightSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true
  }
});

const EquipmentStocksSchema = new mongoose.Schema({
  equipmentName: {
    type: String,
    required: true,
    trim: true
  },
  equipmentNo: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  counterWeights: [counterWeightSchema],
  totalCounterWeight: {
    type: Number,
    required: true,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});



module.exports = mongoose.model('EquipmentStocks', EquipmentStocksSchema);