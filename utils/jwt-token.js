const jwt = require("jsonwebtoken");
const Users = require("../db/Users");
const SECRET_KEY = "BALUKHARADE";

const verifyToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded)
      return res.status(401).json({ error: "Invalid or expired token" });
    const user = await Users.findById(decoded._id);
    if (!user) {
      throw new Error("User is not found");
    }
    const activeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      userType: user?.userType,
    };
    req.user = activeUser;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token", error });
  }
};

//express-session
const verifyExpressToken = (req, res, next) => {
  if (!req?.session?.user) {
    return res.status(401).json({ error: "Session expired." });
  } else {
    next();
  }
};



module.exports = { verifyToken };
