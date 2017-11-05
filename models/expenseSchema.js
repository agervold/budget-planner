var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String, // Alcohol
    total: { type: Number, default: 0 }, // 2496.40
    //entries: [{ type: Schema.Types.ObjectId, ref: 'ExpenseEntry' }],
	user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Expense', expenseSchema);