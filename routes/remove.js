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
    var rb = JSON.parse(req.body.data),
    sheet = rb.sheet, // Name of sheet (Expenses)
    category = rb.category, // Name of category (Everyday)
    name = rb.name, // Name of Expense (Alcohol) 
    ids = rb.ids; // Ids of Entries to be deleted

    var savedI;
    var savedEx;

    User.findById(req.user._id, function(err, doc) {
        var cats = doc[sheet.toLowerCase()+"Categories"];
        var decrement = 0;
        for (var i = 0; i < cats.length; i++) {
            if (cats[i].name == category) {
                savedI = i;
                var expenses = cats[i].expenses;
                for (var ex = 0; ex < expenses.length; ex++) {
                    if (expenses[ex].name == name) {
                        savedEx = ex;
                        var entries = expenses[ex].entries;
                        var newEntries = [];
                        for (var e = 0; e < entries.length; e++) {
                            var dontDelete = true;
                            for (var id = 0; id < ids.length; id++) {
                                if (ids[id] == entries[e]._id) {
                                    dontDelete = false;
                                    decrement += entries[e].cost;
                                    break;
                                }
                            }
                            if (dontDelete) newEntries.push(entries[e]);
                        }
                    }
                }           
            } 
        }
        doc[sheet.toLowerCase()+"Categories"][savedI]["expenses"][savedEx]["total"] -= decrement;
        doc[sheet.toLowerCase()+"Categories"][savedI]["expenses"][savedEx]["entries"] = newEntries;
        User.findByIdAndUpdate(req.user._id, { $set: { "expensesCategories": doc[sheet.toLowerCase()+"Categories"]} }, function(err, newUser) {
            var resObj = {success: true, dec: decrement};
            if (err) {
                resObj.success = false;
                resObj.err = err.message;
            }
            return res.end(JSON.stringify(resObj));
        });
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