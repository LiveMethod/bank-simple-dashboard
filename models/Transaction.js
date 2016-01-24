// ====================
// Transaction
// --------------------
// Mirrors simple's returned JSON data.
// ====================

var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  uuid: {type: String, unique:true}, // txn must have unique uuid
  user_id: String,
  amounts: { 
    amount: Number,
    cleared: Number,
    fees: Number,
    cashback: Number,
    base: Number,
  },
  times: { 
    when_recorded: Number,
    when_recorded_local: String,
    when_received: Number,
    last_modified: Number,
    last_txvia: Number,
  },
  is_active: Boolean,
  record_type: String,
  transaction_type: String,
  bookkeeping_type: String,
  is_hold: Boolean,
  running_balance: Number,
  raw_description: String,
  goal_id: {}, // empty object = "anything goes" schema type
  description: String,
  categories: Array,
  geo: { 
    city: String,
    state: String,
    lat: Number,
    lon: Number,
    timezone: String,
  },
  memo: {}, // empty object = "anything goes" schema type
  labels: {}, // empty object = "anything goes" schema type
  frequency: {}, // empty object = "anything goes" schema type
  arroway_id: {}, // empty object = "anything goes" schema type

});

module.exports = mongoose.model('Transaction', TransactionSchema);