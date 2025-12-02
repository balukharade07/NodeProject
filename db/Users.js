const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    userType: String,
    deleted: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
