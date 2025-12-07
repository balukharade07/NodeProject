const { Router } = require("express");
const bcrypt = require("bcrypt");
const Users = require("../db/Users");
const {
  loginValidation,
  handleValidation,
  userRegisterValidation,
} = require("../utils/validation");
const { verifyToken } = require("../utils/jwt-token");

const authRouter = Router();

authRouter.get("/isLoggendIn", verifyToken, (req, resp, next) => {
  resp.send(req.user);
});

authRouter.post(
  "/signup",
  userRegisterValidation,
  handleValidation,
  async (req, res) => {
    const presentUser = await Users.findOne({ email: req.body.email });

    if (presentUser) {
      return res.status(400).send({ error: "Email already present." });
    }
    try {
      const { firstName, lastName, email, password, age, gender } = req.body;
      
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new Users({
        firstName,
        lastName,
        email,
        age, 
        gender,
        password: passwordHash,
      });
      const result = await user.save();
      res.status(200).send("User Added Succssfully." + result?._id);
    } catch (error) {
      res.status(400).send({ error: "Somthing wrong." });
    }
  }
);

authRouter.post(
  "/login",
  loginValidation,
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).send("INVALID CREDENTIALS");
      }
      const passwordHash = await user.validatePassword(password);
      if (passwordHash) {
        const token = user.getJWT(user);
        userInfo = user;
        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1 * 3600000),
        });
        res.status(200).send(user);
      } else {
        res.status(400).send("INVALID CREDENTIALS");
      }
    } catch (error) {
      res.status(400).send("Somthing is Worng");
    }
  }
);

authRouter.post("/logout", (req, res) => {
  // res.clearCookie("token");
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .status(200)
    .send("Logout Successfully...!!");
});

authRouter.get("/forgotPassword/:email", async (req, res) => {
  const user = await Users.findOne(req.params).select("-password");
  if (!user) {
    res.status(404).send("Eamil is not valid!");
  } else {
    res.status(200).send(user);
  }
});

authRouter.patch("/resetPassword/:_id", async (req, resp) => {
  if (!req.body?.password) return resp.status(400).send("invalid password");
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await Users.updateOne(req.params, {
    $set: { password: passwordHash },
  });

  if (user) {
    resp.status(200).send("Reset Password Successfully...!!");
  } else {
    try {
      throw Error("User not fount");
    } catch (error) {
      return resp.status(400).send("User not fount");
    }
  }
});

module.exports = authRouter;
