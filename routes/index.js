var // Dependencies
express = require('express'),
passport = require('passport'),
create = require('./create'),
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
            
            var expense = findExpense(cats, req.params.category, req.params.expense)
            if (expense.entries.length == 0) {
                res.render('expense', {user: req.user, sheet: req.params.sheet, category: req.params.category, expense: expense, entries: expense.entries});
            } else {
                var ascending = req.query.ascending ? parseInt(req.query.ascending) : 1;
                var sort = req.query.sort || "date";
                sortExpenseEntries(expense.entries, sort, ascending);
                res.render('expense', {user: req.user, sheet: req.params.sheet, category: req.params.category, expense: expense, entries: expense.entries, sort: req.query.sort, ascending: ascending});
            }
        } else if (req.params.category != undefined) {
            var expenses = findCategory(req.user[req.params.sheet.toLowerCase()+"Categories"], req.params.category);
            var monthsTotal = getMonthlyTotal(expenses);
            res.render('table', { user: req.user, expenses: expenses, monthsTotal: monthsTotal, sheet: req.params.sheet, category: req.params.category });
        } else {
            res.render('summary', { user: req.user });          
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
});


router.post('/createCategory', function(req, res) {
    create.category(req, res);
});


router.post('/createExpense', function(req, res) {
    create.expense(req, res);
});


router.post('/createExpenseEntry', function(req, res) {
    create.expenseEntry(req, res);
});

function getMonthlyTotal(expenses) {
    var months = [0,0,0,0,0,0,0,0,0,0,0,0];

    for (var i = 0; i < expenses.length; i++) {
        var entries = expenses[i].entries;
        for (var e = 0; e < entries.length; e++) {
            months[entries[e].date.getMonth()] += entries[e].cost;
        }
    }
    return months;
}

function findCategory(categories, name) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].name == name) {
            return categories[i].expenses;
        }
    }
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

function sortExpenseEntries(entries, sort, ascending) {
    if (sort == "date" || sort == "cost") {
        if (ascending) {
            entries.sort(function(a, b) {
                return a[sort] - b[sort];
            });
        } else {
            entries.sort(function(a, b) {
                return b[sort] - a[sort];
            });
        }
    } else if (sort == "source") {
        if (ascending) {
            entries.sort(function(a, b) {
                return a.source.localeCompare(b.source);
            });
        } else {
            entries.sort(function(a, b) {
                return b.source.localeCompare(a.source);
            });
        }
    }
    return entries;
}

module.exports = router;