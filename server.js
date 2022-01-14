require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const expressSession = require("express-session");
const Transaction = require('./models/transaction')
const User = require('./models/user')
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
const userController = require("./routes/user");

app.use(methodOverride('_method'))
app.use(bodyparser.urlencoded({extended:true}));

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.use('/transactions', transactionsRouter)

app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))


app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}




app.get('/all', async (req,res) => {
  const transactions =  await Transaction.find().sort({
    createdAt: 'desc'
  })
  res.render('transactions/index', { transactions: transactions})
})

app.get('/', (req, res) => {
  res.render('landing')
})

//Register & Login
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', userController.create);

app.get('/login', (req, res) => {
  res.render('login')
})

app.post("/login", userController.login);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/login');
})


app.listen(WEB_PORT, () => {
    console.log(`Example app listening at http://localhost:${WEB_PORT}`);
  });
