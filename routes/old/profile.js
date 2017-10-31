var express = require('express');
var accountSchema = require('../models/account');
var eventSchema = require('../models/pugSchema');
var tournamentSchema = require('../models/tournamentSchema');
var leagueSchema = require('../models/leagueSchema');
var teamSchema = require('../models/teamSchema');
var router = express.Router();

/* GET profile page. */
router.get('/:id', function(req, res, next) {
  
  // temporary to allow non-logged in users access
  if (req.user === undefined) {
    
    // query user by id
    accountSchema.findOne({_id: req.params.id}, function(err, user) {
      // if user is not found
      if (err) {
        // query user by custom url
        accountSchema.findOne({url: req.params.id}, function(err, user) {
          if (err) throw err;
          if (user === null) {
            res.render('error2', { title: 'Error', message: 'User not found.' });
          } else {
            res.render('user/profile', { title: 'Event | Profile', o_user: user, own: false });
          }
        });
      
      // if user is found
      } else {
        res.render('user/profile', { title: 'Event | Profile', user: req.user, o_user: user, own: false });
      }
    });
    
  }
  
  // if own profile
  else if (req.params.id == req.user._id || req.params.id == req.user.url) {
    // find all events created by user
    /*
    eventSchema.find({user: req.user.id}, function(err, event){
      res.render('user/profile', { title: 'Event | Profile', user: req.user, events: event, own: true });
    });
    */
    //TODO: Look for the user in participating teams aswell
    tournamentSchema.find({user: req.user.id}, function(err, tournaments) {
      //TODO: Look for the user in participating teams aswell
      leagueSchema.find({user: req.user.id}, function(err, leagues) {
        teamSchema.find({players: req.user.id}, function(err, teams) {
            res.render('user/profile', { title: 'Event | Profile', user: req.user, tournaments: tournaments, leagues: leagues, teams: teams, own: true });
          });
      });
    });

  // if not own profile
  } else {
    
    // query user by id
    accountSchema.findOne({_id: req.params.id}, function(err, user) {
      // if user is not found
      if (err) {
        // query user by custom url
        accountSchema.findOne({url: req.params.id}, function(err, user) {
          if (err) throw err;
          if (user === null) {
            res.render('error2', { title: 'Error', user: req.user, message: 'User not found.' });
          } else {
            res.render('user/profile', { title: 'Event | Profile', user: req.user, o_user: user, own: false });
          }
        });
      
      // if user is found
      } else {
        res.render('user/profile', { title: 'Event | Profile', user: req.user, o_user: user, own: false });
      }
    });
  
  }
  
});

module.exports = router;
