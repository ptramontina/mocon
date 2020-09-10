const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Entry = require('../models/entry')
const PaymentMethod = require('../models/paymentMethod')

router.post('/entries', auth, async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findOne({ _id: req.body.paymentMethod, owner: req.user._id })
    
        if (!paymentMethod) {
            throw new Error('Payment method not found')
        }
    
        const entry = new Entry({
            ...req.body,
            owner: req.user._id
        })
        
        await entry.save()
        res.status(201).send(entry)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/entries', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.type) {
        match.type = req.query.type
    }

    if (req.query.paymentMethod) {
        match.paymentMethod = req.query.paymentMethod
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'entries', 
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

router.get('/entries/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const entry = await Entry.findOne({ _id, owner: req.user._id })

        if (!entry) {
            return res.status(404).send()
        }

        res.send(entry)
    } catch (e) {
        res.status(500).send()       
    }
})

router.patch('/entries/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'amount', 'type', 'paymentMethod']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const entry = await Entry.findOne({ _id: req.params.id, owner: req.user._id })

        if (!entry) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => entry[update] = req.body[update])
        await entry.save()

        res.send(entry)
    } catch (e) {
        res.status(400).send(e)       
    }
})

router.delete('/entries/:id', auth, async (req, res) => {
    try {
        const entry = await Entry.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!entry) {
            return res.status(404).send()
        }

        res.send(entry)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router