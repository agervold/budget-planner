var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var pugSchema = require('../models/pugSchema');
var router = express.Router();

router.get('/', function (req, res) {
  
  // if user is not logged in
  if (req.user === undefined) {
    pugSchema.find(function(err, result) {
        if (err) throw err;
        res.render('index', { title: 'event', user : req.user, events: result });
        console.log(req.connection.remoteAddress);
    });  
  // if user is logged in
  } else {
    /*
    // finds all events
    pugSchema.find(function(err, result) {
      if (err) throw err;
      // finds upcoming events
      //pugSchema.find({ $query: {attending: req.user._id}, $orderby: { date: 1} }, function(err, upcomingEvents){
      pugSchema.find({ attending: req.user._id}, function(err, upcomingEvents){
        if (err) throw err;
        // finds nearby events
        pugSchema.find({city: 'Roskilde'}, function(err, nearbyEvents) {
          if (err) throw err;
          
          res.render('index', { title: 'event', user : req.user, events: result, upcomingEvents: upcomingEvents, nearbyEvents: nearbyEvents, city: 'Roskilde' });
          console.log(req.connection.remoteAddress);
        });    
      }).sort({age: 1}); 
    });  
    */
    // finds all events
    pugSchema.find(function(err, result) {
      if (err) throw err;

        var result2 = [];
        for (var i = 0; i < result.length; i++) {
          result2[result2.length] = {title: result[i].title, lat: result[i].lat, lng: result[i].lng}
        }

        res.render('index', { title: 'pugs', user: req.user, pugs: result, pugs2: result2 });
    });  
  }
  
});

router.post('/register', function(req, res) {
  
  //Account.register(new Account({ username : req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, rating: {total: 0, raters: {}} }), req.body.password, function(err, account) {
  Account.register(new Account({ username : req.body.username, firstName: req.body.firstName, lastName: req.body.lastName/*, 'rating.raters': {'kappa' : 0}*/ /*[]*/ }), req.body.password, function(err, account) {
  //Account.register(new Account({ email : req.body.email }), req.body.password, function(err, account) {
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
    if (! user) {
      return res.render('index', { user: user, status_message: 'error!' });
    }
    req.login(user, function(err) {
      if(err){
        return next(err);
      }
      //return res.render('index', { user: req.user });
      return res.redirect('/');
    });    
  })(req, res, next);
  
});


router.get('/logout', function(req, res) {
  
    req.logout();
    res.redirect('/');
    
});

module.exports = router;
