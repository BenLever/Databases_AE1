require("dotenv").config();

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const expressLayouts = require('express-ejs-layouts')

const { WEB_PORT } = process.env;

const indexRouter = require('./routes/index')

app.use(morgan('tiny'));
app.use(bodyparser.urlencoded({extended:true}))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))


app.use('/', indexRouter)


app.listen(WEB_PORT, () => {
    console.log(`Example app listening at http://localhost:${WEB_PORT}`);
  });
