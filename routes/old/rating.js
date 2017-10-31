var express = require('express');
var accountSchema = require('../models/account');
var router = express.Router();

/* Rate user. */
router.post('/', function(req, res) {
	
	// if user is not logged in
	if (req.user === undefined) {
		
		res.end('Must log in.');
		
	} else {
	
		var rating = req.body.rating;
		var profile_id = req.body.profile_id;
		
		if (rating > 5) {
			rating = 5;
		} else if (rating < 1) {
			rating = 1;
		}
			
		// check if user has already rated
		accountSchema.findById(profile_id, function(err, profile) {
			var array = profile['rating']['raters'];
						
			var old_rating = array.filter(function ( obj, index ) {
				
				if( obj.rater.toString() === req.user._id.toString() ) {
					var old_rating = array[index].rating;
					// update raters rating
					profile.rating.raters[index].rating = parseInt(rating);
					
					var diff = old_rating - rating;
					
					// update total rating
					profile.rating.total -= diff;
					return old_rating;
				}
			})[0];
									
			// if user hasn't rated already
			if (old_rating === undefined) {			
				
				// increments total rating
				profile.rating.total += parseInt(rating);
				
				// adds rater to list of raters
				profile.rating.raters.push({rater: req.user._id, rating: rating});
	
				profile.save();
				
			// if user has rated already
			} else {
				console.log('User already rated!');
				profile.markModified('rating.raters');
				profile.save(function(err) {
					if (err) throw err;
					console.log('rating updated.');
				});
			}
		});
		
	}

	res.redirect('/user/'+req.body.profile_id);
	
});

module.exports = router;

/*
event
plan
organize
experience
fun
social
life
exicited
memories
participate

plinze

plited  plan / exicited
orgait  organize / it
shaife  share / life

glonts  global events
glent

*/
