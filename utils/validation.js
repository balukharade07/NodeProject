const { body } = require("express-validator");

const userRegisterValidation = [
  body("email")
    .isEmail()
    .withMessage("Email is requierd")
    .notEmpty()
    .withMessage("Email is requierd")
    .isString()
    .withMessage("Email must be a string."),
  body("username")
    .notEmpty()
    .withMessage("Name is requierd.")
    .isLength({ min: 3, max: 32 }),
  body("password").notEmpty().withMessage("Password is requierd."),
];

module.exports = { userRegisterValidation };
