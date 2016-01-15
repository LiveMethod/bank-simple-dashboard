// ====================
// Transactions
// --------------------
// Original / unmodified transactions from simple
// ====================

var express = require('express');
var mongoose = require('mongoose');

var Transaction = require('../models/Transaction.js');

var router = express.Router();

// Get all transactions
router.get('/', function(req, res, next) {
  Transaction.find(function(err, txns){
    if(err){
      console.log('error when fetching all transactions: ', err)
      return next(err);
    }
    console.log('Returning all transactions: ');
    res.json(txns);
  });
});

// Create a single transaction
router.post('/', function(req, res, next) {
  Transaction.create(req.body, function(err, txn){
    if(err){
      console.log('error when creating this transaction: ', err)
      return next(err);
    }
    console.log('Creating transaction: ');
    res.json(txn);
  });
});

// Get single transaction with given bank uuid
// eg: curl localhost:3000/transactions/3c7a0627-3052-3891-a16b-928a8f11b99e
router.get('/:uuid', function(req, res, next) {
  var query = {uuid: req.params.uuid};

  Transaction.findOne(query, function(err, txn){
    if (err){
      console.log('error when getting txn with uuid ' + req.params.uuid + ': ', err);
      return next(err);
    };
    console.log('updated txn with uuid '+ req.params.uuid +': ');
    res.json(txn);
  });
});

// Update a single transaction with given bank uuid
router.put('/:uuid', function(req, res, next) {
  var query = {uuid: req.params.uuid};
  
  Transaction.findOneAndUpdate(query, req.body, function(err, txn){
    if (err){
      console.log('error when updating txn with uuid ' + req.params.uuid + ': ', err);
      return next(err);
    };
    console.log('updated txn with uuid '+ req.params.uuid +': ');
    res.json(txn);
  });
});

// Delete a single transaction with a given bank uuid
router.delete('/:uuid', function(req, res, next) {
  var query = {uuid: req.params.uuid};
  
  Transaction.findOneAndRemove(query, function(err, txn){
    if (err){
      console.log('error when deleting txn with uuid ' + req.params.uuid + ': ', err);
      return next(err)
    };
    console.log('deleted txn with uuid '+ req.params.uuid +': ');
    res.json(txn);
  });
});

module.exports = router
