var express = require('express');
var passport = require('passport');
var User = require('../models/schemas').user;
var router = express.Router();

router.get('/', function (req, res) {
    if (req.user == undefined) {
        res.redirect('/');
    } else {
        User.findById(req.user.id, function(err, user) {
            res.render('profile', { user: user });
        });
    }
});

module.exports = router;