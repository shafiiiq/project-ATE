var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var equipementRouter = require('./routes/equipments');
var serviceReport = require('./routes/users');
var productRouter=require('./routes/products');
var serviceHistory=require('./routes/service-history');
var stocksRouter=require('./routes/stocks');

var app = express();
require('./utils/db');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(express.json({ limit: '50gb' }));
app.use(express.urlencoded({ extended: true, limit: 'gb' }));

app.use('/equipments', equipementRouter)
app.use('/service-report', serviceReport);
app.use('/service-history',serviceHistory)
app.use('/stocks', stocksRouter)

module.exports = app;
