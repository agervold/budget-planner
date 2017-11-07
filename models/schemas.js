var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var expenseEntrySchema = new Schema({
    date: { type: Date, default: Date.now },
    cost: Number,
    source: String,
	//expense: { type: Schema.Types.ObjectId, ref: 'Expense' }
});

var expenseSchema = new Schema({
    name: String, 
    total: { type: Number, default: 0 },
    entries: { type: Array, default: [] }
});

var categorySchema = new Schema({
    name: String, 
    expenses: { type: Array, default: [] }
});

var User = new Schema({
    username: String,
    incomeCategories: { type: Array, default: [] },
    expensesCategories: { type: Array, default: [] },
    date: { type: Date, default: Date.now }
});

User.plugin(passportLocalMongoose);

module.exports.entry = mongoose.model('ExpenseEntry', expenseEntrySchema);
module.exports.expense = mongoose.model('Expense', expenseSchema);
module.exports.category = mongoose.model('Category', categorySchema);
module.exports.user = mongoose.model('User', User);