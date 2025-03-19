const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const Users = require("./db/Users");
const Quote = require("./db/Quote");
require("dotenv").config();

require("./db/config");
// const db = require('./db/config');

const SECRET_KEY = "BALUKHARADE"; // Replace with a strong secret key
const app = express();
app.use(cors());

app.use(express.json());

let userInfo = {};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    console.log("err", err);
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

//add user API
app.post("/register", async (req, resp) => {
  const presentUser = await Users.findOne({ email: req.body.email });
  if (presentUser) {
    try {
      throw Error("Email already present.");
    } catch (error) {
      return resp.status(401).send({ error: "Email already present." });
    }
  }
  const user = new Users({ ...req.body, deleted: false });
  const res = await user.save();
  resp.send(res);
});

//Login user API

app.get("/isLoggendIn", verifyToken, (req, resp, next) => {
  resp.send(userInfo);
});

app.post("/login", async (req, resp, next) => {
  console.log("req.body", req.body);
  const user = await Users.findOne(req.body);

  if (user && !user?.deleted) {
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1m",
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

app.delete("/userDelete/:_id", verifyToken, async (req, res) => {
  const user = await Users.updateOne(req.params, { $set: { deleted: true } });
  //console.log(user);
  res.send("Deleted Successfully...!!");
});

app.put("/update/:_id", verifyToken, async (req, resp) => {
  const user = await Users.updateOne(req.params, { $set: req.body });
  if (user) {
    resp.send("User Updated Successfully...!!");
  } else {
    try {
      throw Error("User not fount");
    } catch (error) {
      return resp.status(400).send("User not fount");
    }
  }
});

app.get("/users", verifyToken, async (req, res) => {
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
  res.send(updatedUserList);
});

app.get("/usersList", async (req, res) => {
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
  res.send(updatedUserList);
});

//add Quote API
app.post("/addQuote", verifyToken, async (req, resp) => {
  const addQuote = new Quote(req.body);
  const res = await addQuote.save();
  resp.status(201).send(res);
});

app.put("/editQuote/:_id", verifyToken, async (req, resp) => {
  const data = await Quote.findOne(req.body);
  if (data) {
    try {
      throw Error("Already modify this quote");
    } catch (error) {
      return resp.status(401).send("Already modify this quote");
    }
  } else {
    const quote = await Quote.updateOne(req.params, { $set: req.body });
    resp.send(req.body);
  }
});

app.get("/getAllQuote/:_id", async (req, resp) => {
  try {
    const pageSize = parseInt(req.query.pageSize);
    const page = parseInt(req.query.page);
    let allQuote = [];
    let count = 0;
    if (req.params._id === "all") {
      allQuote = await Quote.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1));
      count = await (await Quote.find({})).length;
    } else {
      allQuote = await Quote.find({
        $or: [{ by: new RegExp(req.params._id, "i") }],
      })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

      count = await (
        await Quote.find({
          $or: [{ by: new RegExp(req.params._id, "i") }],
        })
      ).length;
    }

    const allUser = await Users.find({});
    const userInfo = {};
    allUser.forEach((item) => (userInfo[item._id] = item.username));
    const updatedQuote = allQuote?.map((item) => {
      return {
        _id: item._id,
        quote: item.quote,
        name: userInfo[item.by],
      };
    });
    const result = {
      count,
      result: updatedQuote,
    };
    resp.send(result);
  } catch (e) {
    console.log(e);
  }
});

app.get("/getQuote/:by", verifyToken, async (req, resp) => {
  const addQuote = await Quote.find(req.params);
  resp.send(addQuote);
});

app.delete("/delete/:_id", verifyToken, async (req, resp) => {
  const addQuote = await Quote.deleteOne(req.params);
  resp.send(addQuote);
});

app.get("/profile/:_id", verifyToken, async (req, res) => {
  const user = await Users.findOne(req.params).select("-password");
  const quote = await Quote.find({ by: req.params._id });
  const profile = {
    _id: user._id,
    email: user.email,
    username: user.username,
    quotes: quote,
  };
  res.send(profile);
});

app.get("/forgotPassword/:email", async (req, res) => {
  const user = await Users.findOne(req.params).select("-password");
  if (!user || user?.deleted) {
    try {
      throw Error("Eamil is not valid!");
    } catch (error) {
      return res.status(404).send("Eamil is not valid!");
    }
    ``;
  } else {
    res.send(user);
  }
});

app.listen(5000);
