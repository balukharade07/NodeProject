const express = require("express");
const cors = require("cors");
const Users = require("./db/Users");
const { verifyToken, getJwtToken } = require("./utils/jwt-token");
const { mainRoute } = require("./routes");
const session = require("express-session");
require("dotenv").config();
require("./db/config");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

let userInfo = {};
app.use(
  session({
    secret: "Sairaj",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 60000 * 60 },
  })
);
app.use(mainRoute);

app.get("/isLoggendIn", verifyToken, (req, resp, next) => {
  resp.send(userInfo);
});

app.post("/login", async (req, resp, next) => {
  const user = await Users.findOne(req.body);
  if (user && !user?.deleted) {
    if (userInfo?._id) {
      resp.send({ user, token: getJwtToken() });
    } else {
      userInfo = user;
      resp.send({ user, token: getJwtToken() });
    }
  } else {
    try {
      throw new Error("User not fount");
    } catch (err) {
      return next(err);
    }
  }
});

app.post("/logout", verifyToken, async (req, resp, next) => {
  userInfo = {};
  resp.send("Logout Successfully...!!");
});

app.listen(5000, () => {
  console.log("Server is running on 5000");
});
