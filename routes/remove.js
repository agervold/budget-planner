var User = require('../models/schemas').user;
var Category = require('../models/schemas').category;
var Expense = require('../models/schemas').expense;
var ExpenseEntry = require('../models/schemas').entry;

var category = function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    var sheet = req.body.sheet.toLowerCase()+"Categories", // Name of sheet (Expenses)
    name = req.body.name, // Name of new Category
    pull = {};
    pull[sheet] = {name: name};

    User.findByIdAndUpdate(req.user._id, { $pull: pull }, function(err, doc) {
        var resObj = {success: true};
        if (err) resObj.success = false;
        return res.end(JSON.stringify(resObj));
    });
}

var expense = function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    var rb = req.body,
    sheet = rb.sheet.toLowerCase()+"Categories", // Name of sheet (Expenses)
    category = rb.category, // Name of category (Everyday)
    name = rb.name, // Name of Expense
    query = {_id: req.user._id},
    pull = {};
    
    query[sheet+".name"] = category;
    pull[sheet+".$.expenses"] = {name: name};

    User.update(query, { $pull: pull }, function(err, doc) {
        var resObj = {success: true};
        if (err) {
            resObj.success = false;
            resObj.err = err.message;
        }
        return res.end(JSON.stringify(resObj));
    });
}

var expenseEntry = function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    //req.body = {date: new Date(), cost: 7, source: "Bakken", sheet: "Expenses", category: "Everyday", name: "Alcohol"};
    var rb = req.body,
    sheet = rb.sheet, // Name of sheet (Expenses)
    category = rb.category, // Name of category (Everyday)
    name = rb.name, // Name of Expense (Alcohol) 
    ids = rb.ids,
    categories = req.user[sheet.toLowerCase()+"Categories"]; // Array of Category in selected sheet

    var expense = findExpense(categories, category, name);
    expense.entries.push(new ExpenseEntry({
        date: date,
        cost: cost,
        source: source,
        comment: comment
    }));
    expense.total += cost;
    User.findByIdAndUpdate(req.user._id, {$set: {'expensesCategories': req.user.expensesCategories}}, function(err, doc) {
        var resObj = {success: true};
        if (err) {
            resObj.success = false;                      
        } else {
            resObj.cost = cost;
            resObj.html = `<tr><td>${date}</td><td>${cost}</td><td>${source}</td><td>${comment}</td></tr>`;
        }
        return res.end(JSON.stringify(resObj));
    });
}

function findExpense(categories, category, name) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].name == category) {
            var exs = categories[i].expenses;
            for (var e = 0; e < exs.length; e++) {
                if (exs[e].name == name) {
                    return exs[e];
                }
            }
        }
    }
}

module.exports.category = category;
module.exports.expense = expense;
module.exports.expenseEntry = expenseEntry;