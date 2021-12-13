const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = mongoose.model('Transaction', transactionSchema)