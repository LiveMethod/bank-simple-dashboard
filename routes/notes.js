// ====================
// Notes
// --------------------
// Miscellaneous custom data describing a single Transaction
// ====================

var express = require('express');
var mongoose = require('mongoose');

var Note = require('../models/Note.js');

var router = express.Router();

// Get all notes
router.get('/', function(req, res, next) {
  Note.find(function(err, notes){
    if(err){
      console.log('error when fetching all notes: ', err)
      return next(err);
    }
    console.log('Returning all notes: ');
    res.json(notes);
  });
});

// Get all notes that match IDs in a given array
router.get('/array/', function(req, res, next) {
  var query = {'transaction_uuid': { $in: req.query.array} };

  console.log('query = ',query);
  Note.find(query, function(err, notes){
    if(err){
      console.log('error when fetching all notes: ', err)
      return next(err);
    }
    console.log('Returning all notes from an array: ');
    res.json(notes);
  });
});

// Create or update a single note
router.post('/', function(req, res, next) {
  // query for a note with given uuid
  var query = {transaction_uuid: req.params.transaction_uuid}
  var options = {
    upsert:true, // create if it doesn't exist
    new:true, // return new changed object, not old one
  };

  Note.findOneAndUpdate(query, req.body, options, function(err, note){
    if(err){
      console.log('error when creating this note: ', err)
      return next(err);
    }
    console.log('upserting note: ');
    res.json(note);
  });
});

// Get single note with given transaction uuid
// eg: curl localhost:3000/note/3c7a0627-3052-3891-a16b-928a8f11b99e
router.get('/:transaction_uuid', function(req, res, next) {
  var query = {transaction_uuid: req.params.transaction_uuid};

  Note.findOne(query, function(err, note){
    if (err){
      console.log('error when getting note with uuid ' + req.params.transaction_uuid + ': ', err);
      return next(err);
    };
    console.log('updated note with uuid '+ req.params.transaction_uuid +': ');
    res.json(note);
  });
});

// Update a single note with given transaction uuid
router.put('/:transaction_uuid', function(req, res, next) {
  var query = {transaction_uuid: req.params.transaction_uuid};

  Note.findOneAndUpdate(query, req.body, function(err, note){
    if (err){
      console.log('error when updating note with uuid ' + req.params.transaction_uuid + ': ', err);
      return next(err)
    };
    console.log('updated note with uuid '+ req.params.transaction_uuid +': ');
    res.json(note);
  });
});

// Delete a single note with a given transaction uuid
router.delete('/:transaction_uuid', function(req, res, next) {
  var query = {transaction_uuid: req.params.transaction_uuid};

  Note.findOneAndRemove(query, function(err, note){
    if (err){
      console.log('error when deleting note with uuid ' + req.params.transaction_uuid + ': ', err);
      return next(err)
    };
    console.log('deleted note with uuid '+ req.params.transaction_uuid +': ');
    res.json(note);
  });
});

module.exports = router
