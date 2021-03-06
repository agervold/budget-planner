var express = require('express');
var router = express.Router();
var User = require('../models/schemas').user;
var Category = require('../models/schemas').category;
var Expense = require('../models/schemas').expense;
var ExpenseEntry = require('../models/schemas').entry;


router.post('/category', function(req, res) {
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
        return res.end(resObj(err, ["html", `<a href="/${rb.sheet}/${name}">${name}</a>`]));        
    });
});


router.post('/expense', function(req, res) {
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
        return res.end(resObj(err, ["html", `<tr><td>${name}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>0</td><td>0</td></tr>`]));        
    });
});


router.post('/entry', function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    //req.body = {date: new Date(), cost: 7, source: "Bakken", sheet: "Expenses", category: "Everyday", name: "Alcohol"};
    var rb = req.body,
    date = rb.date,
    cost = parseFloat(rb.cost),
    source = rb.source,
    comment = rb.comment,
    sheet = rb.sheet.toLowerCase(), // Name of Sheet (Expenses)
    category = rb.category, // Name of Category (Everyday)
    name = rb.name, // Name of Expense (Alcohol) 
    categories = req.user[sheet+"Categories"]; // Array of Category in selected sheet

    var expense = findExpense(categories, category, name);
    expense.entries.push(new ExpenseEntry({
        date: date,
        cost: cost,
        source: source,
        comment: comment
    }));
    expense.total += cost;
    var set = {};
    set[sheet+"Categories"] = req.user[sheet+"Categories"];
    var inc = {};
    inc[`${sheet}.${new Date(date).getMonth()}`] = cost;
    inc[`${sheet}.12`] = cost;
    
    User.findByIdAndUpdate(req.user._id, {$set: set, $inc: inc}, function(err, doc) {
        return res.end(resObj(err, ["total", expense.total, "html", `<tr><td>${date}</td><td>${cost}</td><td>${source}</td><td>${comment}</td></tr>`]));        
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

function resObj(err, vals) {
    var resObj = {success: true};
    if (err) {
        resObj.success = false;      
        resObj.err = err.message;                
    } else {
        for (var i = 0; i < vals.length; i+=2) {
            resObj[i] = resObj[i+1];
        }
    }
    return JSON.stringify(resObj);
}
/*
module.exports.category = category;
module.exports.expense = expense;
module.exports.expenseEntry = expenseEntry;
*/
module.exports = router;