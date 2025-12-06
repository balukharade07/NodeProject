const { Router } = require("express");
const Users = require("../db/Users");
const Quote = require("../db/Quote");
const {
  userRegisterValidation,
  handleValidation,
} = require("../utils/validation");
const { verifyToken } = require("../utils/jwt-token");
const bcrypt = require("bcrypt");

const router = Router();

router.post(
  "/register",
  userRegisterValidation,
  handleValidation,
  async (req, res) => {
    const presentUser = await Users.findOne({ email: req.body.email });

    if (presentUser) {
      res.status(400).send({ error: "Email already present." });
    }
    try {
      const { username, email, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new Users({
        username,
        email,
        password: passwordHash,
      });
      const result = await user.save();
      res.status(200).send('User Added Succssfully.' + result?._id);
    } catch (error) {
      res.status(400).send({ error: "Somthing wrong." });
    }
  }
);

router.get("/users", verifyToken, async (req, res) => {
  const allUser = await Users.find({}).select("-password");
  const allQuote = await Quote.find({});
  const updatedUserList = allUser
    ?.filter((d) => !d?.deleted)
    .map((item) => {
      const user = {
        email: item.email,
        username: item.username,
        _id: item._id,
        quote: allQuote?.filter((q) => q.by === item._id.toString()),
        userType: item?.userType,
      };
      return user;
    });
  res.status(200).send(updatedUserList);
});

router.get("/usersList", async (req, res) => {
  const allUser = await Users.find({}).select("-password");
  const updatedUserList = allUser
    ?.filter((d) => !d?.deleted)
    .map((item) => {
      const user = {
        name: item.username,
        _id: item._id,
      };
      return user;
    });
  res.status(200).send(updatedUserList);
});

router.delete("/userDelete/:_id", verifyToken, async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params);
    res.status(200).send("Deleted Successfully...!!");
  } catch (error) {
    res.status(400).send("Somthing wrong!!");
  }
});

router.patch(
  "/update/:_id",
  verifyToken,
  userRegisterValidation,
  handleValidation,
  async (req, resp) => {
    const user = await Users.findByIdAndUpdate(req.params, req.body);
    if (user) {
      resp.status(200).send("User Updated Successfully...!!");
    } else {
      resp.status(400).send("User not fount");
    }
  }
);

router.put("/resetPassword/:_id", async (req, resp) => {
  const user = await Users.updateOne(req.params, { $set: req.body });
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

router.get("/profile/:_id", verifyToken, async (req, res) => {
  const user = await Users.findOne(req.params).select("-password");
  const quote = await Quote.find({ by: req.params._id });
  const profile = {
    _id: user._id,
    email: user.email,
    username: user.username,
    quotes: quote,
  };
  res.status(200).send(profile);
});

router.get("/forgotPassword/:email", async (req, res) => {
  const user = await Users.findOne(req.params).select("-password");
  if (!user || user?.deleted) {
    res.status(404).send("Eamil is not valid!");
  } else {
    res.status(200).send(user);
  }
});

module.exports = { userRouter: router };
