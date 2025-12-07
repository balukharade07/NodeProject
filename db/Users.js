const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const SECRET_KEY = "BALUKHARADE";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      validator(value) {
        if (validator.isEmpty(value)) {
          throw new Error("firstName is requierd.");
        }
      },
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validator(value) {
        if (validator.isEmpty(value)) {
          throw new Error("lastName is requierd.");
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["MALE", "FEMALE", "OTHER"],
        message: `{VALUE} is not gender type`,
      },
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address" + value);
        }
        if (validator.isEmpty(value)) {
          throw new Error("email is requierd.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 5,
    },
    age: {
      type: Number,
      required: true,
      min: [18, "User must be {value} +"],
      max: 90,
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 });

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

module.exports = new mongoose.model("Users", userSchema);
