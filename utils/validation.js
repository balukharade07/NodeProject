const { body, validationResult } = require("express-validator");

const userRegisterValidation = [
  body("email")
    .isEmail()
    .withMessage("Email is requierd")
    .notEmpty()
    .withMessage("Email is requierd")
    .isString()
    .withMessage("Email must be a string."),
  body("firstName")
    .notEmpty()
    .withMessage("Name is requierd.")
    .isLength({ min: 3, max: 32 }),
  body("lastName")
    .notEmpty()
    .withMessage("Last Name is requierd.")
    .isLength({ min: 3, max: 32 }),
  body("age").notEmpty().withMessage("Age is requierd."),
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

const handleUpdatedUserCalidation = (req, res, next) => {
  const allowedFields = ["firstName", "lastName", "email", "age", "gender"];
  const isValidData = Object.keys(req.body || {})?.every((item) =>
    allowedFields.includes(item)
  );

  if (!isValidData) return res.status(400).send("invalid json.");

  next();
};

module.exports = {
  userRegisterValidation,
  addQuoteValidation,
  loginValidation,
  handleValidation,
  handleUpdatedUserCalidation,
};
