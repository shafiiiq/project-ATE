const mongoose = require('mongoose');

const counterWeightSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true
  }
});

const equipmentHandoverSchema = new mongoose.Schema({
  equipmentName: {
    type: String,
    required: true,
    trim: true
  },
  equipmentNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  counterWeights: {
    type: [counterWeightSchema],
    required: true,
    validate: {
      validator: function(array) {
        return array && array.length > 0;
      },
      message: 'At least one counter weight is required'
    }
  },
  totalCounterWeight: {
    type: Number,
    required: true
  },
  images: {
    type: [String], // Array of image paths
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to ensure totalCounterWeight is calculated correctly
equipmentHandoverSchema.pre('save', function(next) {
  // Calculate total counter weight from individual weights
  if (this.counterWeights && this.counterWeights.length > 0) {
    this.totalCounterWeight = this.counterWeights.reduce((total, item) => {
      return total + (parseFloat(item.weight) || 0);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('EquipmentHandover', equipmentHandoverSchema);