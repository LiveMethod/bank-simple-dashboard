// ====================
// Transactions
// --------------------
// Original / unmodified transactions from simple
// ====================

var express = require('express');
var mongoose = require('mongoose');

var Transaction = require('../models/Transaction.js');

var router = express.Router();

// Get all transaction
router.get('/', function(req, res, next) {
  // empty date range
  var dateRangeFilter = {};
  // if query string has all date range data declared,
  // make a filter to pass to the db lookup
  // expects ?y=2016&m=02
  if(req.query.y != null && req.query.m != null){
    var dateRange = req.query.y + '-' + req.query.m;
    dateRangeFilter = {'times.when_recorded_local': new RegExp('^'+dateRange,'i')};
  }

  Transaction.find(dateRangeFilter, function(err, transactions){
    if(err){
      console.log('error when fetching all transactions: ', err)
      return next(err);
    }
    console.log('Returning all transactions: ');
    res.json(transactions);
  });
});

// Create or update a single transaction
router.post('/', function(req, res, next) {
  // query for a transaction with given uuid
  var query = {uuid: req.params.uuid}
  var options = {
    upsert:true, // create if it doesn't exist
    new:true, // return new changed object, not old one
  };

  Transaction.findOneAndUpdate(query, req.body, options, function(err, transaction){
    if (transaction.uuid == null){
      console.log('null transaction ID. This should never happen: ', transaction )
      return next();
    }
    if(err){
      if (err.code === 11000){
        console.log('Transaction already exists with key ');
        return next();
      } else {
        console.log('error when creating this transaction: ', err)
        return next(err);
      }
    }
    console.log("uppppserrr");
    console.log('upserting transaction ', transaction.uuid);
    res.json(transaction);
  });
});

// Get single transaction with given transaction uuid
// eg: curl localhost:3000/transaction/3c7a0627-3052-3891-a16b-928a8f11b99e
router.get('/:transaction_uuid', function(req, res, next) {
  var query = {transaction_uuid: req.params.transaction_uuid};

  Transaction.findOne(query, function(err, transaction){
    if (err){
      console.log('error when getting transaction with uuid ' + req.params.transaction_uuid + ': ', err);
      return next(err);
    };
    console.log('updated transaction with uuid '+ req.params.transaction_uuid +': ');
    res.json(transaction);
  });
});

// Update a single transaction with given bank uuid
router.put('/:transaction_uuid', function(req, res, next) {
  var query = {transaction_uuid: req.params.transaction_uuid};

  Transaction.findOneAndUpdate(query, req.body, function(err, transaction){
    if (err){
      console.log('error when updating transaction with uuid ' + req.params.transaction_uuid + ': ', err);
      return next(err)
    };
    console.log('updated transaction with uuid '+ req.params.transaction_uuid +': ');
    res.json(transaction);
  });
});

// Delete a single transaction with a given bank uuid
router.delete('/:transaction_uuid', function(req, res, next) {
  var query = {transaction_uuid: req.params.transaction_uuid};

  Transaction.findOneAndRemove(query, function(err, transaction){
    if (err){
      console.log('error when deleting transaction with uuid ' + req.params.transaction_uuid + ': ', err);
      return next(err)
    };
    console.log('deleted transaction with uuid '+ req.params.transaction_uuid +': ');
    res.json(transaction);
  });
});

module.exports = router
