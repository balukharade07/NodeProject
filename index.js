const express = require("express");
const cors = require("cors");
const Users = require("./db/Users");
const { verifyToken, getJwtToken } = require("./utils/jwt-token");
const { mainRoute } = require("./routes");
const session = require("express-session");
require("dotenv").config();
const connectDB = require("./db/config");
const { loginValidation, handleValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
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

app.get("/isLoggendIn", verifyToken, (req, resp, next) => {
  resp.send(userInfo);
});

app.post("/login", loginValidation, handleValidation, async (req, resp) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user || user.deleted) {
      return resp.status(400).send("INVALID CREDENTIALS");
    }
    const passwordHash = await bcrypt.compare(password, user.password);
    if (passwordHash) {
      // req.session.user = user;
      const token = getJwtToken(user);
      resp.cookie("token", token);
      resp.status(200).send(user);
      userInfo = user;
      
      // req.session.save(() => {
      //   resp.status(200).send(user);
      // });
    } else {
      resp.status(400).send("INVALID CREDENTIALS");
    }
  } catch (error) {
    resp.status(400).send("Somthing is Worng");
  }
});

app.post("/logout", verifyToken, async (req, resp, next) => {
  userInfo = {};
  resp.clearCookie("token");
  resp.status(200).send("Logout Successfully...!!");
  // req.session.destroy((err) => {
  //   if (err) res.status(400).send("Error!");
  //   resp.status(200).send("Logout Successfully...!!");
  // });
});

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server is running on 5000");
  });
});
