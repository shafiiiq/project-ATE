const mongoose = require('mongoose');
const serviceReportSchema = require('../models/service-report.model');

const ServiceHistorySchema = new mongoose.Schema({
  regNo: {
    type: Number,
    required: true
  },
  date: {
    type: String, // or Date if you prefer actual date object
    required: true
  },
  oil: {
    type: String,
    required: true
  },
  oilFilter: {
    type: String,
    required: true
  },
  fuelFilter: {
    type: String,
    required: true
  },
  waterSeparator: {
    type: String,
    required: true
  },
  airFilter: {
    type: String,
    required: true
  },
  serviceHrs: {
    type: Number,
    required: true
  },
  nextServiceHrs: {
    type: Number,
    required: true
  },
  serviceReport:[]
});

module.exports = mongoose.model('ServiceHistory', ServiceHistorySchema);


 // navigate(`/service-history/${regNo}`);