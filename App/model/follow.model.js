const mongoose = require("mongoose");

const followSchemas = mongoose.Schema({
  quatationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  followup: {
    type: Boolean,
    default: true,
  },
  Approve: {
    type: Boolean,
    default: false,
  },
  Reject: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Follow", followSchemas);
