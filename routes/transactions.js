const express = require('express')
const Transaction = require('./../models/transaction')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('transactions/new_transaction', { transaction: new Transaction() })
})

router.post('/', async (req, res) => {
    let transaction = new Transaction({
        amount: req.body.amount,
        type: req.body.type,
        description: req.body.description,
        date: req.body.date,
    })
    try{
        transaction = await transaction.save() 
        res.redirect('/')
    } catch (e) {
        res.render('transactions/new, { transaction: transaction }')
    }
})

module.exports = router
