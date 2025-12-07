const mongoose = require("mongoose"); //mongoos node to mongoDB connect

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/DevTinder");
};

module.exports = connectDB;
