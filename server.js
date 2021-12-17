require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const Transaction = require('./models/transaction')
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override')
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

app.use(methodOverride('_method'))
app.use(morgan('tiny'));
app.use(bodyparser.urlencoded({extended:true}));

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.use('/transactions', transactionsRouter)




app.get('/', async (req,res) => {
  const transactions =  await Transaction.find().sort({
    createdAt: 'desc'
  })
  res.render('transactions/index', { transactions: transactions})
})


app.listen(WEB_PORT, () => {
    console.log(`Example app listening at http://localhost:${WEB_PORT}`);
  });
