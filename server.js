require("dotenv").config();


const express = require('express');
const mongoose = require('mongoose')
const session = require("express-session");
const Transaction = require('./models/transaction')
const User = require('./models/user')
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const methodOverride = require('method-override')
const app = express();

const { PORT, MONGODB_URI } = process.env;

//DB Connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});

//Controllers
const transactionsRouter = require('./routes/transactions')
const userController = require("./routes/user");

app.use(methodOverride('_method'))
app.use(bodyparser.urlencoded({extended:true}));

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))
app.use('/transactions', transactionsRouter)

app.use(cookieParser('ExpenseTrackerSecure'));
app.use(session({
  secret: 'ExpenseTrackerSecretSession',
  saveUninitialized: true,
  resave: true
}));


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

//Transaction pages
app.get('/all', authMiddleware, async (req,res) => {
  const transactions =  await Transaction.find().sort({
    createdAt: 'desc'
  })
  res.render('transactions/index', { transactions: transactions})
})

app.get('/transactions/new', authMiddleware, (req, res) => {
  res.render('transactions/new_transaction', { transaction: new Transaction() })
})

app.get('/transactions/edit/:id', authMiddleware, async (req, res) => {
  try {
      const transaction = await Transaction.findById(req.params.id)
      res.render('transactions/edit', {transaction: transaction})
  } catch {
      res.redirect('/all')
  }
})

//Home Page
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
  res.redirect('/');
})


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
