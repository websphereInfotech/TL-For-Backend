const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const totalSchemas = Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  description: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    // required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  invoiceNumber: {
    type: String
  },
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Total", totalSchemas);


