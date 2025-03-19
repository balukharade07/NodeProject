const mongoose = require('mongoose'); 

const quoitSchema = new mongoose.Schema({
    quote: String,
    by: String
}, {timestamps: true});

module.exports = mongoose.model('quotes', quoitSchema);