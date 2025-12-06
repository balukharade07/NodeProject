const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = "BALUKHARADE";

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
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 5,
    },
    userType: {
      type: String,
      validate(value) {
        if (!["Admin", "User"].includes(value)) {
          throw new Error("user type is invalid.");
        }
      },
    },
    deleted: Boolean,
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

module.exports = mongoose.model("Users", userSchema);
