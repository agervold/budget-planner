var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema({
    //_id: Schema.Types.ObjectId,
    name: String, // Alcohol
    total: { type: Number, default: 0 }, // 2496.40
    entries: { type: Array, default: [] }
    //entries: [{ type: Schema.ObjectId, ref: 'ExpenseEntry' }],
    //category: { type: Schema.Types.ObjectId, ref: 'Category' }
	//user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Expense', expenseSchema);