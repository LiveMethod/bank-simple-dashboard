// ====================
// Transaction
// --------------------
// Mirrors simple's returned JSON data.
// ====================

var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  // TODO: find out how to make pieces of this required (simple uuid)
  uuid: String,
  amounts: {
    amount: Number,
    cleared: Number,
    fees: Number,
    cashback: Number,
    base: Number,
  },
  times: {
    when_recorded: String,
    when_recorded_local: String,
    when_received: String,
    last_modified: String,
    last_txvia: String,
  },
  is_active: Boolean,
  record_type: String,
  transaction_type: String,
  bookkeeping_type: String,
  is_hold: Boolean,
  running_balance: Number,
  raw_description: String, 
  goal_id: String, // might come in as number. No example on this.
  description: String, // formatted version of raw_description
  categories:[{
    uuid: String,
    name: String,
    fodler: String,
  }],
  geo: {
    city: String,
    state: String,
    lat: Number,
    lon: Number,
    timezone: String,
  },
  memo: String,
  labels: String,
  frequency: String, // no idea what this comes in as
  arroway_id: String // no idea what this is either
});

module.exports = mongoose.model('Transaction', TransactionSchema);