var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var request = require('request');

var routes = require('./routes/index');
var transactions = require('./routes/transactions');
var notes = require('./routes/notes');

expressLess = require('express-less');

var app = express();

// these are just for the sketchy txn adding
var mongoose = require('mongoose');
var Transaction = require('./models/Transaction.js');

// connect to mongodb
mongoose.connect('mongodb://localhost/simple-bank-backend', function(err) {
  if(err){
    console.log('error in app mongoose.connect():',err);
  } else { 
    console.log('mongoose connected. GG!!!');
  };
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/less-css', expressLess(__dirname + '/less'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// link  URLs to their routes
app.use('/', routes);
app.use('/transactions', transactions);
app.use('/notes', notes);

// test 3rd party scrape

///////
///////
///////

var apiBase = 'https://bank.simple.com';
var localhost = 'http://localhost:3000'
var csrfRegex = /<meta name="_csrf" content="(.*)">/;

user= // FIXME: pull from secrets dir
pass= // FIXME: pull from secrets dir
// cookie jar! Stores csrf and other session stuff
jar = request.jar();

// get the CSRF token (accepts callback)
function getCSRF(cb){
  console.log('starting csrf');
  // new request, specifying URL and cookie jar
  request({url: apiBase, jar: jar}, function(err,res,body){
    // if there's an error, yell
    if (err) {console.log('get csrf err: ', err);}
    // otherwise, perform the callback, passing null to the
    // first spot (traditionally used for errors. if we got here, there are none)
    // and passing the formatted CSRF token as the second param.
    console.log('done csrf?');
    if(cb != undefined) cb(null, csrfRegex.exec(body)[1]);
  })
}

function login(cb){
  console.log('attepting login.');

  var requestOptions = {
    method: 'POST',
    url: apiBase + '/signin',
    jar: jar,
    form: {
      username: user,
      password: pass,
    },
  };

  // call the CSRF method, passing in the login guts as
  // a callback, so that they execute only once the token
  // request comes back successfully.
  getCSRF(function(err,token){
    // add the csrf token to the form object
    requestOptions.form._csrf = token;

    console.log('starting login');
    // new request with the options
    request(requestOptions, function(err,res,body){
      if (err) {console.log('login err: ', err);}
      if (res.statusCode !== 303){console.log('Login rejected: '+res.statusCode);}
      else {console.log('you sholud be logged in.')}
      // do whatever next thing was passed in. 
      if(cb != undefined)cb();
    })
  })
}

function getTransactions(){
  var requestOptions = {
    url: apiBase + '/transactions/data?all=true',
    jar: jar,
    json: true,
  };

  console.log('starting transactions get');
  request(requestOptions, function(err,res,body){
    if (err) {console.log('err getting transactions: ', err);}
    if (res.statusCode === 302) {console.log('U ant loged n breh', err);}
    if (res.statusCode !== 200) {console.log('status code ', res.statusCode);}
    if (res.statusCode === 200) {
      console.log('Got ' + body.transactions.length + ' transactions')
      for (var transaction in body.transactions){
        addTransactionWithoutAPI(body.transactions[transaction]);
      }
    }
  });
}

function addTransactionWithoutAPI(transaction){
  var query = {uuid: transaction.uuid}
  var options = {
    upsert:true, // create if it doesn't exist
    new:true, // return new changed object, not old one
  };

  Transaction.findOneAndUpdate(query, transaction, options, function(err, transaction){
    if (transaction.uuid == null){
      console.log('null transaction ID. This should never happen: ', transaction )
      return null;
    }
    if(err){
      if (err.code === 11000){
        console.log('Transaction already exists with key ');
        return null;
      } else {
        console.log('error when creating this transaction: ', err)
        return null;
      }
    }
    console.log('upserting transaction ', transaction.uuid);
  });
}

// Scrape all simple txns into the db
// login(getTransactions);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
