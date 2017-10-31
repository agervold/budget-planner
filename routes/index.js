var express = require('express');
var passport = require('passport');
var User = require('../models/userSchema');
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


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/:category?', function (req, res) {
    if (req.user != undefined) {
        res.render('index', { user: req.user/*, categories: categories,*/, category: req.params.category });
    } else {
        res.render('register');
    }
});


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

module.exports = router;