const jwt = require('jsonwebtoken');
const Users = require('../db/Users');
const SECRET_KEY = 'BALUKHARADE';

const getLoggedInUser = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await Users.findById(decoded._id);
    const activeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };
    req.user = activeUser;
    next();
  } catch (error) {
    req.user = undefined;
    next();
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded)
      return res.status(401).json({ error: 'Invalid or expired token' });
    const user = await Users.findById(decoded._id);
    if (!user) {
      throw new Error('User is not found');
    }
    const activeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };
    req.user = activeUser;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token', error });
  }
};

//express-session
const verifyExpressToken = (req, res, next) => {
  if (!req?.session?.user) {
    return res.status(401).json({ error: 'Session expired.' });
  } else {
    next();
  }
};

module.exports = { verifyToken, getLoggedInUser };
