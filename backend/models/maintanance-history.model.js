const mongoose = require('mongoose');

const MaintananceHistorySchema = new mongoose.Schema({
  regNo: {
    type: Number,
    required: true
  },
  date: {
    type: String, // or Date if you prefer actual date object
    required: true
  },
  equipment: {
    type: String,
    required: true
  },
  mechanics: {
    type: String,
    required: true
  },
  workRemarks: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('MainatanceHistory', MaintananceHistorySchema);