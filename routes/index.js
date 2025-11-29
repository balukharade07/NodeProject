const { Router } = require("express");
const { quoteRouter } = require("./quote");
const { userRouter } = require("./user-routes");

const router = Router();

router.use(userRouter);
router.use(quoteRouter);

module.exports = { mainRoute: router };
