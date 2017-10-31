var express = require('express');
var multer = require('multer');
var AccoutSchema = require('../models/account'); 
var pugSchema = require('../models/pugSchema');
var PollSchema = require('../models/pollSchema');
var MessageSchema = require('../models/messageSchema');
var router = express.Router();

var mongoose = require('mongoose');

// GET pug page
router.get('/:id', function(req, res, next) {
  
  var user_id = req.user._id;
  
  pugSchema.findById(req.params.id, function(err, result) {
    if (err) throw err;
    // if event is not found
    if (result === null) {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Event not found.'});
         
    // if allowed to see event ( not private || created event || in attending array || in invited array )
    } else if ( result.priv === false || result.user.toString() === user_id.toString() || result.attending.indexOf(user_id) >= 0 || result.invited.indexOf(user_id) >= 0 ) {
      
      PollSchema.find(function(err, polls) {
        if (err) throw err;
        
        MessageSchema.find({event: req.params.id}, function(err, messages) {
          if (err) throw err;
          
          AccoutSchema.findById(result.user, function(err, creator) {
            if (err) throw err;

            var coords = 
            [
              {
                title: result.title,
                lat: result.lat,
                lng: result.lng
              }
            ];
            
            res.render('pug/pug', { title: 'event | '+result.title, event: result, user: req.user, polls: polls, messages: messages, creator: creator, coords: coords });

          });
        });       
      }); 

    // if event is private
    } else {
      
      res.render('error2', {title: 'Error', user: req.user, message: 'Private Event'});
      
    }
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

// POST invite person
router.post('/invite', function(req, res) {
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