var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter=require('./routes/products');
var serviceHistory=require('./routes/service-history');

var app = express();
require('./utils/db');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
// app.use('/', indexRouter);
app.use('/service-report', usersRouter);
// app.use('/products',productRouter)
app.use('/service-history',serviceHistory)

module.exports = app;
