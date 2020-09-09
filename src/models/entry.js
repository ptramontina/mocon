const mongoose = require('mongoose')
const validator = require('validator')

const entrySchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true
    },
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'PaymentMethod'
    }
}, {
    timestamps: true
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry