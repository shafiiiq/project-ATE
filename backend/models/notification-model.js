const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  regNo: {
    type: Number,
    required: true
  },
  nextFullServiceHrs: {
    type: Number, // or Date if you prefer actual date object
    required: true
  },
  lastServiceHrs: {
    type: Number,
    required: true
  },
  mechine: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Notifications', NotificationSchema);