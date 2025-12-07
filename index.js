const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();
const connectDB = require("./db/config");
const cookieParser = require("cookie-parser");

const mainRoute = require("./routes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Sairaj",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 * 60 },
  })
);
app.use("/", mainRoute);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server is running on 5000");
  });
});
