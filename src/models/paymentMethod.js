const mongoose = require('mongoose')

const paymentMethodSchema = new mongoose.Schema({
    description: {
        type: Number,
        required: true,
    },
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // }
}, {
    timestamps: true
})

paymentMethodSchema.virtual('user', {
    ref: 'User',
    localField: '_id',
    foreignField: 'owner'
})

paymentMethodSchema.virtual('entry', {
    ref: 'Entry',
    localField: '_id',
    foreignField: 'paymentMethod'
})

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema)

module.exports = PaymentMethod