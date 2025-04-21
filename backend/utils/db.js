const mongoose = require('mongoose');
module.exports=mongoose.connect('mongodb://localhost:27017/alansari')
.then((result) => {
  console.log("mongoDB connected");
}).catch((err) => {
  console.log("DB connection failed");
});