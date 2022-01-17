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
    createdAt: {
        type: Date,
        default: Date.now
    },
});

transactionSchema.index({type: 'text', description: 'text' });




module.exports = mongoose.model('Transaction', transactionSchema)