const mongoose = require('mongoose');  //mongoos node to mongoDB connect

const connectDB = async () => {
    console.log("===connect DB===")
   await mongoose.connect('mongodb://localhost:27017/e-comm')
}

module.exports = connectDB;