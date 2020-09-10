const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const PaymentMethod = require('../models/paymentMethod')

router.post('/payment-methods', auth, async (req, res) => {
    try {    
        const paymentMethod = new PaymentMethod({
            ...req.body,
            owner: req.user._id
        })
        
        await paymentMethod.save()
        res.status(201).send(paymentMethod)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/payment-methods', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'paymentMethods', 
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.entries)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/payment-methods/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const paymentMethod = await PaymentMethod.findOne({ _id, owner: req.user._id })

        if (!paymentMethod) {
            return res.status(404).send()
        }

        res.send(paymentMethod)
    } catch (e) {
        res.status(500).send()       
    }
})

router.patch('/payment-methods/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const paymentMethod = await PaymentMethod.findOne({ _id: req.params.id, owner: req.user._id })

        if (!paymentMethod) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => paymentMethod[update] = req.body[update])
        await paymentMethod.save()

        res.send(paymentMethod)
    } catch (e) {
        res.status(400).send(e)       
    }
})

router.delete('/payment-methods/:id', auth, async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!paymentMethod) {
            return res.status(404).send()
        }

        res.send(paymentMethod)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router