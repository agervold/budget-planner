var User = require('../models/schemas').user;
var Category = require('../models/schemas').category;
var Expense = require('../models/schemas').expense;
var ExpenseEntry = require('../models/schemas').entry;

var category = function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    var rb = req.body,
    name = rb.name, // Name of new Category
    sheet = rb.sheet.toLowerCase()+"Categories"; // Name of sheet (Expenses)
    if (name == "") name = "Unnamed";

    var newCategory = new Category({
        name: name
    });

    var push = {};
    push[sheet] = newCategory;

    User.findByIdAndUpdate(req.user._id, {$push: push }, function(err, doc) {
        var resObj = {success: true};
        if (err) {
            resObj.success = false;                      
        } else {
            resObj.html = `<a href="/${rb.sheet}/${name}">${name}</a>`;
        }
        return res.end(JSON.stringify(resObj));
    });
}

var expense = function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    var rb = req.body,
    name = rb.name, // Name of new Expense
    sheet = rb.sheet.toLowerCase()+"Categories", // Name of sheet (Expenses)
    category = rb.category; // Name of category (Everyday)
    var push = {};
    var query = {_id: req.user._id};
    query[sheet+".name"] = category;

    var newExpense = new Expense({
        name: name
    });
    
    push[sheet+".$.expenses"] = newExpense;
    User.update(query, {$push: push }, function(err, doc) {
        var resObj = {success: true};
        if (err) {
            resObj.success = false;                      
        } else {
            resObj.html = `<tr><td>${name}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>0</td><td>0</td></tr>`;
        }
        return res.end(JSON.stringify(resObj));
    });
}

var expenseEntry = function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    //req.body = {date: new Date(), cost: 7, source: "Bakken", sheet: "Expenses", category: "Everyday", name: "Alcohol"};
    var rb = req.body,
    entriesChanges = JSON.parse(req.body.entries);
    sheet = rb.sheet, // Name of sheet (Expenses)
    category = rb.category, // Name of category (Everyday)
    name = rb.name, // Name of Expense (Alcohol) 
    categories = req.user[sheet.toLowerCase()+"Categories"]; // Array of Category in selected sheet

    var expense = findExpense(categories, category, name);
    var entries = expense.entries;
    var changed = 0;

    for (var i = 0; i < entries.length; i++) {
        for (var e = 0; e < entriesChanges.length; e++) {
            if (entries[i]._id == entriesChanges[e][0]) {
                if (entriesChanges[e][1] == "entryDate") {
                    entries[i].date = entriesChanges[e][2];
                } else if (entriesChanges[e][1] == "entryCost") {
                    var diff = entriesChanges[e][2] - entries[i].cost;
                    expense.total += diff;
                    entries[i].cost = entriesChanges[e][2];
                } else if (entriesChanges[e][1] == "entrySource") {
                    entries[i].source = entriesChanges[e][2];
                } else if (entriesChanges[e][1] == "entryComment") {
                    entries[i].comment = entriesChanges[e][2];
                }
                if (++changed == entriesChanges.length) break;
            }
        }
        
    }
    // TODO: Have 'expensesCategories' be dynamic, not hardcoded.
    User.findByIdAndUpdate(req.user._id, {$set: {'expensesCategories': req.user.expensesCategories}}, function(err, doc) {
        var resObj = {success: true};
        if (err) {
            resObj.success = false;                      
        } else {
            resObj.total = expense.total;
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