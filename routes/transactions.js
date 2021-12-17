const express = require('express')
const Transaction = require('./../models/transaction')
const router = express.Router()


router.post('/', async (req, res) => {
    let transaction = new Transaction({
        amount: req.body.amount,
        type: req.body.type,
        description: req.body.description,
    })
    try{
        transaction = await transaction.save() 
        res.redirect('/')
    } catch (e) {
        res.render('transactions/new_transaction', { transaction: transaction })
    }
})

router.get('/new', (req, res) => {
    res.render('transactions/new_transaction', { transaction: new Transaction() })
})

router.get('/:id', (req, res) => {
    res.send("Show Transaction" + req.params.id)
})

router.get('/:id/edit', async (req, res) => {
    try {
        const transaction = Transaction.findById(req.params.id)
        res.render('transactions/edit', {transaction: transaction})
    } catch {
        res.redirect('/')
    }
})

router.put('/:id', async (req, res) => {
    req.transaction = await Transaction.findById(req.params.id)
    let transaction = req.transaction
    transaction.amount = req.body.amount
    transaction.type = req.body.type
    transaction.description = req.body.description
    try {
        transaction = await transaction.save()
        res.redirect('/')
    } catch (e) {
        res.render('transactions/edit', {transaction: transaction})
    }
})

router.delete('/:id', async (req, res) => {
    await Transaction.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


module.exports = router
