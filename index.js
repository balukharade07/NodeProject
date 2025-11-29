const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const Users = require("./db/Users");
const { verifyToken } = require("./utils");
const { mainRoute } = require("./routes");
require("dotenv").config();

require("./db/config");

const SECRET_KEY = "BALUKHARADE";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

let userInfo = {};

app.use(mainRoute);

app.get("/isLoggendIn", verifyToken, (req, resp, next) => {
  resp.send(userInfo);
});

app.post("/login", async (req, resp, next) => {
  const user = await Users.findOne(req.body);

  if (user && !user?.deleted) {
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    if (userInfo?._id) {
      resp.send({ user, token });
    } else {
      userInfo = user;
      resp.send({ user, token });
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
