const { body, validationResult } = require("express-validator");

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

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Email is requierd")
    .notEmpty()
    .withMessage("Email is requierd")
    .isString()
    .withMessage("Email must be a string."),
  body("password").notEmpty().withMessage("Password is requierd."),
];

const addQuoteValidation = [
  body("quote")
    .notEmpty()
    .withMessage("Quote is requierd.")
    .isString()
    .withMessage("Data type string requierd."),
];

const handleValidation = (req, resp, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    resp.status(400).send({ errors: result.array() });
    return;
  } else {
    next();
  }
};

module.exports = { userRegisterValidation, addQuoteValidation, loginValidation, handleValidation };
