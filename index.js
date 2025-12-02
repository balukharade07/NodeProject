const express = require("express");
const cors = require("cors");
const Users = require("./db/Users");
const {
  verifyToken,
  getJwtToken,
  verifyExpressToken,
} = require("./utils/jwt-token");
const { mainRoute } = require("./routes");
const session = require("express-session");
require("dotenv").config();
const connectDB = require("./db/config");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

let userInfo = {};
app.use(
  session({
    secret: "Sairaj",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 * 60 },
  })
);
app.use(mainRoute);

app.get("/isLoggendIn", verifyExpressToken, (req, resp, next) => {
  resp.send(userInfo);
});

app.post("/login", async (req, resp) => {
  const user = await Users.findOne(req.body);
  if (!user || user.deleted) {
    return resp.status(400).send("BAD CREDENTIALS");
  }

  req.session.user = user;
  req.session.save(() => {
    resp.status(200).send({
      user,
      token: getJwtToken(user),
    });
  });
});

app.post("/logout", verifyExpressToken, async (req, resp, next) => {
  userInfo = {};
  req.session.destroy((err) => {
    if (err) res.status(400).send("Error!");
    resp.status(200).send("Logout Successfully...!!");
  });
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server is running on 5000");
  });
});
