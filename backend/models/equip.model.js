const mongoose = require('mongoose');

const Equipments = new mongoose.Schema({
  id: Number,
  machine: String,
  regNo: String,
  coc: String, // "YES" or "NO"
  brand: String,
  year: Number,
  istimaraExpiry: String,      // format: "dd-mm-yyyy"
  insuranceExpiry: String,     // format: "dd-mm-yyyy"
  tpcExpiry: String,           // format: "dd-mm-yyyy"
  certificationBody: String
});

module.exports = mongoose.model('Equipments', Equipments);
