// ====================
// Scraper
// --------------------
// Scrapes bank simple API
// ====================

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var http = require('http');
var request = require('request');

var Transaction = require('../models/Transaction.js');

var secrets = require('../secrets/secrets');

// scrape simple TXNs whenever this endpoint is hit
// be reasonable with the rate here.
// (lol yeah i know #sideprojectQA)
router.get('/', function(req, res, next) {
  login(getTransactions);
});


var apiBase = 'https://bank.simple.com';
var localhost = 'http://localhost:3000'
var csrfRegex = /<meta name="_csrf" content="(.*)">/;

// login credentials for simple.com (stored in secrets dir)
user = secrets.simpleUser;
pass = secrets.simplePass;
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

module.exports = router
