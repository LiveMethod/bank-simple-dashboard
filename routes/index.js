var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET home page. */
router.get('/', function(req, res) {
  // TODO: get each of these UUIDs and query for matching notes
  Transaction.find(
    {'times.when_recorded_local': new RegExp('^'+'2016','i')},
    function(err,data){
      res.render('index', {transactions: JSON.stringify(data) });
    }
  )  
});

module.exports = router;
