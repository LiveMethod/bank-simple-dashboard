var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var request = require('request');

var index = require('./routes/index');
var transactions = require('./routes/transactions');
var notes = require('./routes/notes');
var scraper = require('./routes/scraper');

var expressLess = require('express-less');

var expressApp = express();

// connect to mongodb
mongoose.connect('mongodb://localhost/simple-bank-backend', function(err) {
  if(err){
    console.log('error in app mongoose.connect():',err);
  } else { 
    console.log('mongoose connected. GG!!!');
  };
});

// view engine setup
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('view engine', 'jade');
expressApp.use('/less-css', expressLess(__dirname + '/less'));

// uncomment after placing your favicon in /public
//expressApp.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
expressApp.use(logger('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(cookieParser());
expressApp.use(express.static(path.join(__dirname, 'public')));

// link  URLs to their routes
expressApp.use('/', index);
expressApp.use('/scrape', scraper);
expressApp.use('/api/transactions', transactions);
expressApp.use('/api/notes', notes);

// catch 404 and forward to error handler
expressApp.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (expressApp.get('env') === 'development') {
  expressApp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
expressApp.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = expressApp;
