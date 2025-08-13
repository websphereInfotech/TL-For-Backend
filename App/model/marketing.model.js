const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marketingschema = Schema(
  {

    date: {
      type: Date,
      required: true,
    },
    login_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      unique: true,
      required: true,
    },
    addressTwo: {
      type: String,
    },
    nextEmergingDate: {
      type: Date
    },
    remark: {
      type: String,
    },
  },
  { strictPopulate: false }
);

const marketing = mongoose.model("marketing", marketingschema);

module.exports = marketing;
