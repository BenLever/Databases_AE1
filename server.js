require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

const { WEB_PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});

const transactionsRouter = require('./routes/transactions')

app.use(morgan('tiny'));
app.use(bodyparser.urlencoded({extended:true}))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.use('/transactions', transactionsRouter)



app.get('/', (req,res) => {
  const transactions = [{
    amount: '£40',
    type: 'Other',
    description: 'Petrol Charge',
    date: '30-12-2021',
  },
  {
    amount: '£90',
    type: 'Food',
    description: 'Lunch',
    date: '30-11-2001', 
  }]
  res.render('transactions/index', { transactions: transactions})
})


app.listen(WEB_PORT, () => {
    console.log(`Example app listening at http://localhost:${WEB_PORT}`);
  });
