const { string, array } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userschema = Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    mobileNo: {
      type: Number,
      require: true,
      unique: true,
    },
    address: {
      type: String,
    },
    serialNumber: {
      type: Number,
      require: true,
      unique: true,
    },
    rate: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    Date: {
      type: Date,
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
    total: {
      type: Number,
      require: true,
    },
    sales: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesPerson",
    },
    architec: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "architectuer",
      },
    ],
    carpenter: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carpenter",
      },
    ],
    shop: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop",
      },
    ],
  },
  { strictPopulate: false }
);
const user = mongoose.model("user", userschema);

module.exports = user;
