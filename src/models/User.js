const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
    symbol: { type: String, required: true},
    quantity: { type: Number, required: true}
});

const userSchema = new mongoose.Schema({
    useID: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    portfolio: [portfolioItemSchema]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);