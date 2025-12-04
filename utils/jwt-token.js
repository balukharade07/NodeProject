const jwt = require("jsonwebtoken");
const SECRET_KEY = "BALUKHARADE";

const verifyToken = (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) res.status(401).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err)
        return res.status(401).json({ error: "Invalid or expired token" });
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
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

const getJwtToken = (user) => {
  const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = { verifyToken, getJwtToken, verifyToken };
