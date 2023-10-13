const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const totalSchemas = Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  description: {
    type: String,
    require: true,
  },
  area: {
    type: String,
    require: true,
  },
  size: {
    type: Number,
    require: true,
  },
  rate: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  total: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Total", totalSchemas);


