var express = require('express');
var router = express.Router();
var User = require('../models/schemas').user;
var Category = require('../models/schemas').category;
var Expense = require('../models/schemas').expense;
var ExpenseEntry = require('../models/schemas').entry;


router.post('/category', function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    var rb = req.body,
    name = rb.name; // New Name of Category
    oldName = rb.oldName, // Old Name of Category
    sheet = rb.sheet.toLowerCase()+"Categories"; // Name of sheet (Expenses)

    var q = {_id: req.user._id};
    q[sheet+".name"] = oldName;

    var set = {};
    set[sheet+".$.name"] = name;

    User.update(q, {$set: set}, function(err, doc) {
        return res.end(resObj(err, "url", `/${rb.sheet}/${name}`));
    });
});


router.post('/expense', function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    //TODO: Fix
    var name = rb.name; // New Name of Expense
    sheet = rb.sheet.toLowerCase()+"Categories", // Name of sheet (Expenses)
    category = rb.category; // Name of category (Everyday)
    var push = {};
    var query = {_id: req.user._id};
    query[sheet+".name"] = category;
    
    push[sheet+".$.expenses"] = newExpense;
    // TODO: Have expensesCategories not be hardcoded
    User.update({_id: req.user._id, "expensesCategories.$.name": oldName}, {name: name }, function(err, doc) {
        return res.end(resObj(err, "html", `<tr><td>${name}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>0</td><td>0</td></tr>`));
    });
});


router.post('/entry', function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    var rb = req.body,
    entriesChanges = JSON.parse(req.body.entries);
    sheet = rb.sheet.toLowerCase()+"Categories", // Name of Sheet
    category = rb.category, // Name of Category
    name = rb.name, // Name of Expense
    categories = req.user[sheet]; // Array of Category(s) in selected Sheet

    var expense = findExpense(categories, category, name);
    var entries = expense.entries;
    var changed = 0;

    for (var i = 0; i < entries.length; i++) {
        for (var e = 0; e < entriesChanges.length; e++) {
            var cur = entriesChanges[e];
            if (entries[i]._id == cur[0]) {
                if (cur[1] == "entryDate") {
                    entries[i].date = new Date(cur[2]);
                } else if (cur[1] == "entryCost") {
                    var diff = cur[2] - entries[i].cost;
                    expense.total += diff;
                    entries[i].cost = parseInt(cur[2]);
                } else if (cur[1] == "entrySource") {
                    entries[i].source = cur[2];
                } else if (cur[1] == "entryComment") {
                    entries[i].comment = cur[2];
                }
                if (++changed == entriesChanges.length) break;
            }
        }
        
    }
    var set = {};
    set[sheet] = req.user[sheet];
    User.findByIdAndUpdate(req.user._id, {$set: set}, function(err, doc) {
        return res.end(resObj(err, "total", expense.total));
    });
});

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

function resObj(err, name, val) {
    var resObj = {success: true};
    if (err) {
        resObj.success = false;      
        resObj.err = err.message;                
    } else {
        resObj[name] = val;
    }
    return JSON.stringify(resObj);
}
/*
module.exports.category = category;
module.exports.expense = expense;
module.exports.expenseEntry = expenseEntry;
*/
module.exports = router;