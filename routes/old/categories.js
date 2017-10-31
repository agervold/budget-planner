var express = require('express');
var eventSchema = require('../models/pugSchema');
var router = express.Router();

var categories = 
{
  nightlife: ['clubbing', 'bar', 'party', 'jazz', 'kappa'],
  sports: ['football', 'basketball', 'tennis', 'esports'],
  seminars: [],
  entertainment: ['opera', 'comedy'],
  nature: ['hiking', 'rock climbing', 'kayacking'],
  tech: [],
  music: ['concert'],
  travelling: ['city', 'resort', 'adventure', 'work'],
  creative: ['painting', 'sculpting'],
  culinary: ['food', 'wine tasting']
}  
  
router.get('/:category?', function(req, res) {
  
  var category = req.params.category;
  if (category !== undefined) {
    category = category.toLowerCase();
  }

  // if category doesn't exist
  if (category == undefined || !(category in categories)) {
    res.render('category', { user : req.user, specified: false });
  } else {
    
    var a = category.split('');
    a[0] = a[0].toUpperCase();
    var t_category = a.join('');
    
    // query events
    eventSchema.find({category: t_category}, function(err, events) {
      if (err) throw err;
      console.log(events);
      res.render('category', 
                { 
                  title: 'event | ' + t_category, 
                  category: t_category, 
                  subs: categories[category], 
                  user: req.user, 
                  specified: true, 
                  events: events 
                });
    });  
  }
  
  //res.render('category')
  
});

module.exports = router;