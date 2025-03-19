const mongoose = require('mongoose');  //mongoos node to mongoDB connect

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: String,
    password: String,
    userType: String,
    deleted: Boolean
}, {timestamps: true});

module.exports = mongoose.model('users', userSchema);