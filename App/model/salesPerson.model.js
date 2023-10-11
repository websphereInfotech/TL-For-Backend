const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salesPersonSchemas = Schema({
  Name: {
    type: String,
    require: true,
  },
  mobileNo: {
    type: Number,
    require: true,
    unique:true
  },
});

module.exports = mongoose.model("SalesPerson", salesPersonSchemas);
