// ====================
// Note
// --------------------
// Miscellaneous custom data describing a single Transaction
//
// Notes store references to Transactions so that Transactions
// don't have to store anything that doesn't already exist in
// the Simple API JSON response. This simplifies updates.
// ====================

var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
  transaction_uuid: {type:String, unique:true}, // the txn this note describes
  necessity: Number, // 1-10. FIXME: That limit is unenforced
});

module.exports = mongoose.model('Note', NoteSchema);