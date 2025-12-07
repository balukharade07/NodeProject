const { Router } = require("express");
// const { quoteRouter } = require("./quote");
const  userRouter = require("./userRoutes");
const authRouter = require('./authRouter')
const connectionRequestRouter = require('./connectionRequestRouter')

const mainRoute = Router();

// router.use(quoteRouter);
mainRoute.use(userRouter);
mainRoute.use(authRouter);
mainRoute.use(connectionRequestRouter);


module.exports = mainRoute
