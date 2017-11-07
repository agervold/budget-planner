var // Dependencies
express = require('express'),
passport = require('passport'),
mongoose = require('mongoose'),
// Models
ExpenseEntry = require('../models/schemas').entry,
Expense = require('../models/schemas').expense,
Category = require('../models/schemas').category,
User = require('../models/schemas').user,

router = express.Router();

var groceries = {
    amount: 568.20,
    entries: [
        {
            date: new Date(2017, 8, 5),
            amount: 229.15, 
            source: "Netto"
        },
        {
            date: new Date(2017, 8, 9),
            amount: 56.75, 
            source: "Lidl"
        },
        {
            date: new Date(2017, 8, 11),
            amount: 282.30, 
            source: "Føtex"
        }
    ]
}
var takeaway = {
    amount: 210,
    entries: [
        {
            date: new Date(2017, 8, 4),
            amount: 75.04, 
            source: "Domino's"
        },
        {
            date: new Date(2017, 8, 8),
            amount: 85, 
            source: "McDonald's"
        },
        {
            date: new Date(2017, 8, 9),
            amount: 50, 
            source: "Luna Rossa"
        }
    ]
}
var drinking = {
    amount: 390,
    entries: [
        {
            date: new Date(2017, 8, 30),
            amount: 180, 
            source: "Vintønden"
        },
        {
            date: new Date(2017, 8, 30),
            amount: 60, 
            source: "Bakken"
        },
        {
            date: new Date(2017, 9, 3),
            amount: 150, 
            source: "Vintønden"
        }
    ]
}

var categories = {
    Entertainment: ["Netflix", "Spotify", "HBO", "Viaplay"], 
    Everyday: ["Groceries", "Takeaway", "Alcohol", "Restaurants", "Personal supplies", "Clothes","Laundry/dry cleaning", "Hair/beauty", "Subscriptions", "Other", "Fitness World"]
}


router.get('/summary', function(req, res) {
    res.render('summary', { user: req.user, sheet: "summary" });       
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/:sheet?/:category?/:expense?', function (req, res) {
    if (req.user != undefined) {
        if (req.params.expense != undefined) {
            var name = req.params.expense;
            var cats = req.user[req.params.sheet.toLowerCase()+"Categories"];
            for (var i = 0; i < cats.length; i++) {
                if (cats[i].name == req.params.category) {
                    var exs = cats[i].expenses;
                    for (var e = 0; e < exs.length; e++) {
                        if (exs[e].name == req.params.expense) {
                            var expense = exs[e];
                            if (expense.entries.length == 0) {
                                res.render('expense', {user: req.user, sheet: req.params.sheet, category: req.params.category, expense: expense, entries: expense.entries});
                            } else {
                                /*
                                var ascending = 1;
                                if (req.query.ascending == 0) ascending = -1;
            
                                var sort = {date: ascending};
                                switch(req.query.sort) {
                                    case "cost":
                                        sort = {cost: ascending};
                                        break;
                                    case "source":
                                        sort = {source: ascending};
                                        break;
                                }
            
                                ExpenseEntry.find({ expense: expense._id}).sort(sort).exec(function(err2, entries) {
                                    res.render('expense', {user: req.user, incomeCategories: incomeCategories, expensesCategories: expensesCategories, expense: expense, entries: entries, sort: req.query.sort, ascending: ascending});
                                });
                                */
                                res.render('expense', {user: req.user, sheet: req.params.sheet, category: req.params.category, expense: expense, entries: expense.entries});
                            }
                        }
                    }
                }
            }
            /*
            Expense.findOne({ name: name, user: req.user.id }, function(err, expense) {
                if (err) res.render('error', {user: req.user, error: err});
                if (expense == undefined) { // if expense doesn't exist, create it
                    //res.render('error', {user: req.user, error: "Couldn't find expense"});
                    var expense = new Expense({
                        _id: new mongoose.Types.ObjectId(),
                        name: name,
                        user: req.user._id           
                    });
                    expense.save(function(err) {
                        if (err) console.log(err);
                        else {
                            console.log("expense that didn't exist before, now does");
                            res.render('expense', {user: req.user, expense: expense, entries: []});
                        }
                    });
                } else {                    
                    var ascending = 1;
                    if (req.query.ascending == 0) ascending = -1;

                    var sort = {date: ascending};
                    switch(req.query.sort) {
                        case "cost":
                            sort = {cost: ascending};
                            break;
                        case "source":
                            sort = {source: ascending};
                            break;
                    }

                    ExpenseEntry.find({ expense: expense._id}).sort(sort).exec(function(err2, entries) {
                        res.render('expense', {user: req.user, incomeCategories: incomeCategories, expensesCategories: expensesCategories, expense: expense, entries: entries, sort: req.query.sort, ascending: ascending});
                    });
                }
            });
            */
        } else {
            if (req.params.category != undefined) {
                res.render('table', { user: req.user, sheet: req.params.sheet, category: req.params.category });
            } else {
                res.render('summary', { user: req.user, sheet: req.params.sheet });                
            }
        }
        /*
        var cat = req.params.category;
        if (cat != undefined) cat = cat.toLowerCase();
        var ex = req.params.expense;
        if (ex != undefined) ex = ex.toLowerCase();
        res.render('index', { user: req.user/, categories: categories,/, sheet: req.params.sheet, category: cat, expense: ex });
        */
    } else {
        res.render('register');
    }
});
//var defaultIncomeCategories = ["Wages", "Other"];
//var defaultExpensesCategories = ["Everyday", "Entertainment", "Utilities", "Home", "Insurance", "Technology", "Transportation", "Travel", "Education", "Other"];
var defaultIncomeCategories = {
    "Wages": ["Paycheck", "Tips", "Commision"],
    "Other": ["Gifts", "Refunds", "Dividens"]
};
var defaultExpensesCategories = {
    "Everyday": ["Groceries", "Takeaway", "Alcohol"],
    "Entertainment": ["Netflix", "Spotify", "HBO"]
};

function getExpense(name) {
    return new Expense({
        name: name     
    });
}
function getCategories(obj) {
    var categories = [];
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var expenses = [];
        for (var e = 0; e < obj[keys[i]].length; e++) {
            //saveExpense(obj[keys[i]][e], category._id);
            expenses.push(getExpense(obj[keys[i]][e]));
        }

        var category = new Category({
            name: keys[i],
            expenses: expenses
        });

        categories.push(category);
    }
    return categories;
}
router.post('/register', function(req, res) {
    var incomeCategories = getCategories(defaultIncomeCategories);
    var expensesCategories = getCategories(defaultExpensesCategories);

    var user = new User({ 
        username: req.body.username,
        incomeCategories: incomeCategories,
        expensesCategories: expensesCategories
    });
    User.register(user, req.body.password, function(err, User) {
        if (err) {
            console.log(err);
            return res.render('index', { status_message : 'email already taken' });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');          
        });
    });
});
  

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.render('register', { status_message: 'error!' });
        }
        req.login(user, function(err) {
            if(err){
                return next(err);
            }
            //return res.render('index', { user: req.user });
            return res.redirect('/');
            //return res.redirect('/expenses/everyday/Alcohol');
        });    
    })(req, res, next);
})


router.post('/createExpenseEntry', function(req, res) {
    if (req.user == undefined) return res.end("not logged in");
    
    //req.body = {date: new Date(), cost: 7, source: "Bakken", sheet: "Expenses", category: "Everyday", name: "Alcohol"};

    var rb = req.body,
    date = rb.date,
    cost = parseFloat(rb.cost),
    source = rb.source,
    sheet = rb.sheet, // Name of sheet (Expenses)
    category = rb.category, // Name of category (Everyday)
    name = rb.name, // Name of Expense (Alcohol) 
    categories = req.user[sheet.toLowerCase()+"Categories"]; // Array of Category in selected sheet

    for (var i = 0; i < categories.length; i++) {
        if (categories[i].name == category) {
            var exs = categories[i].expenses;
            for (var e = 0; e < exs.length; e++) {
                if (exs[e].name == name) {
                    exs[e].entries.push(new ExpenseEntry({
                        date: date,
                        cost: cost,
                        source: source
                    }));
                    exs[e].total += cost;
                    User.findByIdAndUpdate(req.user._id, {$set: {'expensesCategories': req.user.expensesCategories}}, function(err, doc) {
                        var resObj = {success: true};
                        if (err) {
                            resObj.success = false;                      
                        } else {
                            resObj.cost = cost;
                            resObj.html = `<tr><td>${date}</td><td>${cost}</td><td>${source}</td></tr>`;
                        }
                        return res.end(JSON.stringify(resObj));
                    });
                }
            }
        }
    }
});

module.exports = router;