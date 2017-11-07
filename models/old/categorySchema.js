var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    //_id: Schema.Types.ObjectId,
    name: String, // Everyday
    //sheet: String, // Income & Expense
    expenses: { type: Array, default: [] }
    //expenses: [{ type: Schema.ObjectId, ref: 'Expense' }],
    //user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Category', categorySchema);