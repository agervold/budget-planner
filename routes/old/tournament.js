var express = require('express');
var multer = require('multer');
var AccoutSchema = require('../models/account'); 
var pugSchema = require('../models/pugSchema');
var tournamentSchema = require('../models/tournamentSchema');
var PollSchema = require('../models/pollSchema');
var MessageSchema = require('../models/messageSchema');
var router = express.Router();

var mongoose = require('mongoose');

// GET tournament page
router.get('/:id', function(req, res, next) {
  
  var user_id = req.user._id;
  
  tournamentSchema.findById(req.params.id, function(err, tournament) {
    if (err) throw err;
    // if event is not found
    if (tournament === null) {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Tournament not found.'});
         
    // if allowed to see event ( not private || created event || in attending array || in invited array )
    } else if ( tournament.priv === false || tournament.user.toString() === user_id.toString() || tournament.attending.indexOf(user_id) >= 0 || tournament.invited.indexOf(user_id) >= 0 ) {
      
      PollSchema.find(function(err, polls) {
        if (err) throw err;
        
        MessageSchema.find({event: req.params.id}, function(err, messages) {
          if (err) throw err;
          
          AccoutSchema.findById(tournament.user, function(err, creator) {
            if (err) throw err;

            var coords = 
            [
              {
                title: tournament.title,
                lat: tournament.lat,
                lng: tournament.lng
              }
            ];

            var nato = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa"];
            var groups = [];
            for (var g = 0; g < 4; g++) {
            var group = [];
            for (var t = 0; t < 4; t++) {
                group[t] = nato[g*4+t];
            }
            groups[g] = group;
            }
            //groups = groups.concat(groups);
            res.render('pug/tournament', { title: 'Tournament | '+tournament.title, tournament: tournament, user: req.user, creator: creator, coords: coords, groups: groups });
            
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
    var newTournament = tournamentSchema({
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
        user: req.user.id
    });

    console.log(newTournament);
    
    newTournament.save(function(err){
        if (err) throw err;
        
        console.log('tournament saved');
        AccoutSchema.findByIdAndUpdate(req.user.id, { $push: { "tournaments": newTournament.id } }, function(err) {
            if (err) throw err;

            res.redirect('/tournament/'+newTournament._id); 
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
    tournamentSchema.findById(tournamentId, function(err, tournament) {
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