var // Dependencies
express = require('express'),
passport = require('passport'),
create = require('./create'),
edit = require('./edit'),
remove = require('./remove'),
// Models
Models = require('../models/schemas'),
ExpenseEntry = Models.entry,
Expense = Models.expense,
Category = Models.category,
User = Models.user,

router = express.Router();

var categories = {
    Entertainment: ["Netflix", "Spotify", "HBO", "Viaplay"], 
    Everyday: ["Groceries", "Takeaway", "Alcohol", "Restaurants", "Personal supplies", "Clothes","Laundry/dry cleaning", "Hair/beauty", "Subscriptions", "Other", "Fitness World"]
}

router.get('/summary', function(req, res) {
    res.render('summary', { user: req.user, sheet: "summary" });       
});

router.get('/setup', function(req, res) {
    res.render('setup', {defaultIncomeCategories: defaultIncomeCategories, defaultExpensesCategories: defaultExpensesCategories});       
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/:sheet?/:category?/:expense?', function (req, res) {
    if (req.user == undefined) return res.render("register");
    if (!req.user.setup) return res.render("setup", {defaultIncomeCategories: defaultIncomeCategories, defaultExpensesCategories: defaultExpensesCategories});
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
        res.render('category', { user: req.user, expenses: expenses, monthsTotal: monthsTotal, sheet: req.params.sheet, category: req.params.category });
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
    
});
//var defaultIncomeCategories = ["Wages", "Other"];
//var defaultExpensesCategories = ["Everyday", "Entertainment", "Utilities", "Home", "Insurance", "Technology", "Transportation", "Travel", "Education", "Other"];
var defaultIncomeCategories = {
    "Wages": ["Paycheck", "Tips", "Commision"],
    "Other": ["Gifts", "Refunds", "Dividends"]
};
var defaultExpensesCategories = {
    "Everyday": ["Groceries", "Takeaway", "Alcohol"],
    "Entertainment": ["Netflix", "Spotify", "HBO"],
    "Utilities": [],
    "Home": ["Rent/mortgage", "Ejerforening", "Property taxes", "Furnishings", "Lawn/garden", "Supplies", "Maintenance", "Improvements", "Moving", "Other"],
    "Insurance": [],
    "Technology": [],
    //"Transportation": [],
    "Travel": [],
    "Debt": []
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
function getCategories2(obj, selected) {
    var categories = [];
    for (var i = 0; i < selected.length; i++) {
        var expenses = [];
        for (var e = 0; e < obj[selected[i]].length; e++) {
            //saveExpense(obj[keys[i]][e], category._id);
            //TODO: Only temporary while all categories don't have expenses
            var ex = obj[selected[i]][e];
            if (ex != undefined) expenses.push(getExpense(ex));
        }

        var category = new Category({
            name: selected[i],
            expenses: expenses
        });

        categories.push(category);
    }
    return categories;
}
router.post('/register', function(req, res) {
    var user = new User({ 
        username: req.body.username
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
        } else if (!user) { // If the user doesn't exist, try to create it
            var user = new User({ 
                username: req.body.username
            });
            User.register(user, req.body.password, function(err, User) {
                if (err) {
                    return res.render('register', { status_message : 'A user with the given email is already registered' });
                }
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');          
                });
            });
        } else {
            req.login(user, function(err) {
                if(err){
                    return next(err);
                }
                return res.redirect('/');
            });    
        }
    })(req, res, next);
});


router.post("/setup", function(req, res) {
    var incomeSelected = JSON.parse(req.body.incomeSelected);
    var expensesSelected = JSON.parse(req.body.expensesSelected);
    var balance = parseInt(req.body.balance);
    var incomeCategories = getCategories2(defaultIncomeCategories, incomeSelected);
    var expensesCategories = getCategories2(defaultExpensesCategories, expensesSelected);

    var update = {
        $set: {
            startingBalance: balance,
            setup: true,
            incomeCategories: incomeCategories,
            expensesCategories: expensesCategories
        },
    }

    User.findByIdAndUpdate(req.user._id, update, function(err, doc) {
        if (err) throw err;
        res.redirect('/');
    });
});

/*
router.post('/createCategory', function(req, res) {
    create.category(req, res);
});

router.post('/createExpense', function(req, res) {
    create.expense(req, res);
});

router.post('/createExpenseEntry', function(req, res) {
    create.expenseEntry(req, res);
});


router.post('/editExpenseEntry', function(req, res) {
    edit.expenseEntry(req, res);
});


router.post('/removeCategory', function(req, res) {
    remove.category(req, res);
});

router.post('/removeExpense', function(req, res) {
    remove.expense(req, res);
});

router.post('/removeEntry', function(req, res) {
    remove.expenseEntry(req, res);
});
*/

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