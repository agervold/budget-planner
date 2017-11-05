var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/userSchema');
var Expense = require('../models/expenseSchema');
var ExpenseEntry = require('../models/expenseEntrySchema');
var router = express.Router();

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

router.get('/:sheet?/:category?/:expense?', function (req, res) {
    if (req.user != undefined) {
        if (req.params.expense != undefined) {
            var name = req.params.expense;
            Expense.findOne({ name: name, user: req.user.id }, function(err, expense) {
                if (err) res.render('error', {user: req.user, error: err});
                if (expense == undefined) {
                    res.render('error', {user: req.user, error: "Couldn't find expense"});
                } else {
                    ExpenseEntry.find({ expense: expense._id}, function(err2, entries) {
                        res.render('expense', {user: req.user, expense: expense, entries: entries});
                    });
                }
            });
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

/*
router.get('/expense', function(req, res) {
    //var name = req.params.expense;
    var name = req.query.ex
    /
    Expense.
        findOne({ name: 'Alcohol'}).
            populate('user').
            exec(function(err, expense) {
                if (err) res.end(err);
                res.end(expense.user.name);
            });
    /
    if (req.user == undefined) {
        res.redirect('/');
    } else {
        Expense.findOne({ name: name, user: req.user.id }, function(err, expense) {
            if (err) res.end(err);
            if (expense == undefined) {
                res.end("Couldn't find expense");
            } else {
                //res.end(`Name: ${expense.name}, Total: ${expense.total}`);
                ExpenseEntry.find({ expense: expense._id}, function(err2, entries) {
                    //res.end(JSON.stringify(entries));
                    res.render('expense', {user: req.user, expense: expense, entries: entries});
                });
            }
        });
    }
});
*/


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/*
router.get('/:category?', function (req, res) {
    if (req.user != undefined) {
        var cat = req.params.category;
        if (cat != undefined) cat = cat.toLowerCase();
        res.render('index', { user: req.user/*, categories: categories,*, category: cat });
    } else {
        res.render('register');
    }
});
*/



/*
router.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName }), req.body.password, function(err, User) {
        if (err) {
            console.log(err);
            return res.render('index', { status_message : 'email already taken' });
        }
        
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});
*/
router.post('/register', function(req, res) {
    var newUser = new User({ 
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    User.register(newUser, req.body.password, function(err, User) {
        if (err) {
            console.log(err);
            return res.render('index', { status_message : 'email already taken' });
        }
        var expense = new Expense({
            _id: new mongoose.Types.ObjectId(),
            name: "Alcohol",
            user: newUser._id           
        });
        expense.save(function(err) {
            if (err) console.log(err);
            else console.log("expenses added?");
        });
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});
  
/*
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }), 
    function(req, res) {
        res.redirect('/');
    }
);
*/
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
        });    
    })(req, res, next);
})

router.post('/createExpenseEntry', function(req, res) {
    var name = req.body.name;
    var date = req.body.date;
    //var cost = Math.floor(Math.random() * (200 - 20) + 20);
    var cost = req.body.cost;
    var source = req.body.source;
    //if (req.query.name != undefined) name = req.query.name;
    Expense.findOneAndUpdate({ name: name, user: req.user.id }, {$inc: {total: cost}}, function(err, expense) {
        if (err) res.end(err);
        if (expense == undefined) {
            res.end("Couldn't find expense");
        } else {
            var newExpenseEntry = new ExpenseEntry({
                date: date,
                cost: cost,
                source: source,
                expense: expense._id
            });

            var resObj = {success: true};
            newExpenseEntry.save(function(error) {
                //res.end("Entry added");
                if (error) resObj.success = false;
                //resObj.entry = newExpenseEntry;
                resObj.html = `<tr><td>${date}</td><td>${cost}</td><td>${source}</td></tr>`;
                res.end(JSON.stringify(resObj));
            });
        }
    });
});

module.exports = router;