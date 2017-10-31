var express = require('express');
var multer = require('multer');
var AccoutSchema = require('../models/account'); 
var teamSchema = require('../models/teamSchema');
var router = express.Router();

var mongoose = require('mongoose');

// GET team page
router.get('/:id', function(req, res, next) {
  
  var user_id = req.user._id;
  
  teamSchema.findById(req.params.id, function(err, team) {
    if (err) throw err;
    // if team is not found
    if (team === null) {   
      res.render('error2', {title: 'Error', user: req.user, message: 'Team not found.'});        
    } else {    
      AccoutSchema.find({'_id': { $in: team.players}}, function(err, players) {
        res.render('team', { title: 'Team | '+team.name, team: team, user: req.user, players: players });
      });
    }
  });
});


module.exports = router;