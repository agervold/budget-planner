var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseEntrySchema = new Schema({
    date: Date, // 30/10/2017
    cost: Number, // 180
    source: String, // Vintønden
	expense: { type: Schema.Types.ObjectId, ref: 'Expense' }
});

module.exports = mongoose.model('ExpenseEntry', expenseEntrySchema);