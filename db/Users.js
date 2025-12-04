const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 5,
    },
    userType: {
      type: String,
      validate(value){
        if(!['Admin', 'User'].includes(value)){
          throw new Error("user type is invalid.");
        }
      }
    },
    deleted: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
