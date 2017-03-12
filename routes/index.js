var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Transaction = require('../models/Transaction.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET home page. */
router.get('/theme', function(req, res) {
  res.render('theme');
});

module.exports = router;
