const mongoose = require('mongoose');

const transactionScheme = new mongoose.Schema({
    userId: {type: String, required: true},
    symbol: {type: String, required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true},
    status: {type: String, enum: ['success', 'failed'], required: true},
    timestamp: {type: Date, default: Date.now}
}, {timestamps: true});

module.exports = mongoose.model('Transaction', transactionScheme);