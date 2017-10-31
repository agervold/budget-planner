var express = require('express');
var multer = require('multer');
var AccoutSchema = require('../models/account'); 
var pugSchema = require('../models/pugSchema');
var leagueSchema = require('../models/leagueSchema');
var PollSchema = require('../models/pollSchema');
var MessageSchema = require('../models/messageSchema');
var router = express.Router();

var mongoose = require('mongoose');

// GET league page
router.get('/:id', function(req, res, next) {
  
  var user_id = req.user._id;
  
  leagueSchema.findById(req.params.id, function(err, league) {
    if (err) throw err;
    // if event is not found
    if (league === null) {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'League not found.'});
         
    // if allowed to see event ( not private || created event || in attending array || in invited array )
    } else if ( league.priv === false || league.user.toString() === user_id.toString() || league.attending.indexOf(user_id) >= 0 || league.invited.indexOf(user_id) >= 0 ) {
      
      PollSchema.find(function(err, polls) {
        if (err) throw err;
        
        MessageSchema.find({event: req.params.id}, function(err, messages) {
          if (err) throw err;
          
          AccoutSchema.findById(league.user, function(err, creator) {
            if (err) throw err;

            var coords = 
            [
              {
                title: league.title,
                lat: league.lat,
                lng: league.lng
              }
            ];

            //league.teams = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa"];

            league.teams =
            [
                {
                    "name": "Alpha",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Bravo",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Charlie",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Delta",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Echo",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Foxtrot",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Golf",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Hotel",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "India",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Juliet",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Kilo",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Lima",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Mike",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "November",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Oscar",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                },
                {
                    "name": "Papa",
                    "points": 0,
                    "matches": 0,
                    "wins": 0,
                    "losses": 0,
                    "goals1": 0,
                    "goals2": 0
                }
            ]

            res.render('pug/league', { title: 'league | '+league.title, league: league, user: req.user, creator: creator, coords: coords });
            
          });
        });       
      }); 

    // if event is private
    } else {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Private Event'});
      
    }
  });
});

router.post('/create', function(req, res) {
    var newLeague = leagueSchema({
        title: req.body.title,
        venue: req.body.venue,
        street: req.body.street,
        number: req.body.number,
        city: req.body.city,
        country: req.body.country,
        //lat: lat,
        //lng: lng,
        sport: req.body.sport,
        format: req.body.format,
        day: req.body.date,
        time: req.body.time,
        date: Date.parse(req.body.date + ' ' + req.body.time),
        priv: req.body.private || false,
        description: req.body.info,
        size: req.body.size,
        user: req.user.id
    });

    console.log(newLeague);
    
    newLeague.save(function(err){
        if (err) throw err;
        
        console.log('league saved');
        AccoutSchema.findByIdAndUpdate(req.user.id, { $push: { "leagues": newLeague.id } }, function(err) {
            if (err) throw err;

            res.redirect('/league/'+newLeague._id); 
        });
    });
});

// GET event settings
router.get('/:id/settings', function(req, res) {
  pugSchema.findById(req.params.id, function(err, result) {
    if (err) throw err;
    // if event is not found
    if (result === null) {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Event not found.'});
         
    // if creater   
    } else if (result.user.toString() === req.user._id.toString() /* || user in attending array*/) {
      
      res.render('pug/settings', { title: 'event | '+result.title, event: result, user: req.user });

    // if event is private
    } else {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Don\'t have permission.'});
      
    }
  });
});

// GET event images
router.get('/:id/images', function(req, res) {
  
  pugSchema.findById(req.params.id, function(err, result) {
    if (err) throw err;
    // if event is not found
    if (result === null) {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Event not found.'});
         
    // if event is private
    } else if (result.priv === true) {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Don\'t have permission.'});
      
    // if all is good
    } else {
      
      res.render('pug/images', { title: 'event | '+result.title, event: result, user: req.user });
      
    }
  });
  
});

// POST change event privacy
router.post('/private', function(req, res) {
  pugSchema.findById(req.body.event_id, function(err, event) {
    if (err) throw err;
    console.log('req.user._id: '+req.user._id);
    console.log('event.user: '+event.user);
    if (event.user.toString() == req.user._id.toString()) {
      event.priv = !event.priv;
    
      event.save(function(err) {
        if (err) throw err;
      
        res.end('Private status changed.');
      });
    } else {
      res.end('Don\'t have permission.');
    }  
  });
});

// POST delete event
router.post('/delete', function(req, res) {
  pugSchema.remove({_id: req.body.event_id, user: req.user._id}, function(err, removed) {
    if (err) throw err;
    console.log(removed);
    if (removed.result.n === 0) {
      res.end('Don\'t have permission.');
    } else {
      res.end('Deleted');
    }
  });
});

// POST event settings
router.post('/settings', multer({ dest: './public/images/uploaded/' }).single('upl'), function(req, res) {
  
  console.log('event id: '+req.body.event_id);
  pugSchema.findByIdAndUpdate(req.body.event_id, 
    { $set: 
      {
        //image: req.file.filename,
        'settings.messages': req.body.messages,
        'settings.notComing': req.body.notComing,
        'settings.invite': req.body.invite,
        'settings.uploadImage': req.body.uploadImage,
        'settings.poll': req.body.poll,
        'settings.facebook': req.body.facebook,
        'settings.twitter': req.body.twitter
      } 
    }, 
    function(err, result) {
      if (err) throw err;
      
      res.end('settings updated?');
    }
  );

});

// POST event attend/unattend
router.post('/attend', function(req, res) {
  
  // query event
  pugSchema.findById(req.body.event_id, function(err, event) {
    // if attend
    if (req.body.action === 'attend') {
      // if event is public or user is invited
      if (event.priv === false || event.invited.indexOf(req.user._id) >= 0 ) {
        // if user is not already in attending list
        if (event.attending.indexOf(req.user._id) < 0) {
          event.attending.push(req.user._id);
        
          event.save(function(err) {
            if (err) throw err;
            res.end('User added to attending list.');
          });
        } else {
          res.end('Already in list.');
        }    
      } else {
        res.end('Don\'t have permission.');
      }
    // if un-attend
    } else if (req.body.action === 'un-attend'){
      // if in attending list
      if (event.attending.indexOf(req.user._id) >= 0) {
        event.attending.pop(req.user._id);
      
        event.save(function(err) {
          if (err) throw err;
          res.end('User removed from attending list.');
        });
      } else {
        res.end('Not on list.');
      }
    }
    
  });  
  
});

// POST invite team to tournament
router.post('/invite', function(req, res) {
    var tournamentId = req.headers.referer.replace("http://localhost:3000/tournament/", "");
    leagueSchema.findById(tournamentId, function(err, tournament) {
        if (tournament.user === req.user.id) {
            tournament.teams.push(req.body.teamName);
            tournament.save(function(err) {
                if (err) throw err;

                res.end("Team added");
            });
        } else {
            res.end("permission denied");
        }
    });

    /*
    // remember proper authentication!
    pugSchema.findById(req.body.event_id, function(err, event) {
        if (err) throw err;
        if (event === null) {
            res.end('Event not found.');
        } else {
            // adds notification to user
            AccoutSchema.findOne({username: req.body.username}, function(err, user) {
            user.notifications.push({
                message: req.user.firstName + ' ' + req.user.lastName + ' has invited you to ' + event.title,
                user: req.user._id,
                event: req.body.event_id,
                date: new Date(),
                type: 'invite'
            });
            
            user.save(function(err) {
                if (err) throw err;
                res.end('Invitation send!');
            });
            
            // adds user to invited list
            event.invited.push(user._id);
            
            event.save(function(err) {
                if (err) throw err;
            });
            });
        }
    });
    */
});

// POST upload image
router.post('/upload_image', multer({ dest: './public/images/uploaded/' }).single('upl'), function(req,res){ 
  
  pugSchema.findById(req.body.event_id, function(err, event) {
    if (err) throw err;
    event.images.push(req.file.filename);
    
    event.save();
  });
  
	res.status(204).end();
});

module.exports = router;