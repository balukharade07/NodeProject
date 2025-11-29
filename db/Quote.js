const mongoose = require("mongoose");

const quoitSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    by: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("quotes", quoitSchema);
