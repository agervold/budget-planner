var express = require('express');
var accountSchema = require('../models/account');
var urlSchema = require('../models/urlSchema');
var router = express.Router();

/* Create custom url */
router.post('/', function(req, res) {
	var url = req.body.url;
	var old_url = req.user.url;
	
	if ( url.length > 0 ) {
	
		urlSchema.findOne({url: url}, function(err, result) {
			
			// if url isn't taken
			if (result == null) {
				var newUrl = urlSchema({
					user: req.user._id,
					url: url
				});
				
				newUrl.save(function(err) {
					if (err) throw err;
					console.log('Custom url saved!');
					
					accountSchema.findByIdAndUpdate(req.user._id, {$set: {url: url}}, function(err, result) {
						if (err) throw err;
						console.log('Custom url saved to user!');
						
						//res.redirect('/user/'+url);
						res.end('Success!');
						
						if (old_url !== undefined) {
							urlSchema.findOneAndRemove({url: old_url}, function(err, result) {
								if (err) throw err;
								console.log('Old url was removed!');
							});
						}
						
					});	
				});
				
			// if url is taken
			} else {
				console.log('Custom url taken!');
				//res.redirect('/user/'+req.user._id);
				res.end('The url is already taken');
			}
		});
		
	} else {
		res.end('Must enter something');
	}
});

module.exports = router;