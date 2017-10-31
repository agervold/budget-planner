var express = require('express');
var PollSchema = require('../models/pollSchema');
var router = express.Router();

router.post('/create', function(req,res,next) {
	
	var results = new Object;
	
	results[req.body.choice_1] = 1;
	results[req.body.choice_2] = 2;
	results[req.body.choice_3] = 3;
	
	var newPoll = new PollSchema({
		question: req.body.question,
		choices: [req.body.choice_1, req.body.choice_2, req.body.choice_3],
		results: results,
		//event: 'temp',
		user: req.user._id	
	});
	
	newPoll.save(function(err) {
		if (err) throw err;
		res.end('Success!!');
	});
});

router.post('/vote', function(req, res) {
	console.log(req.body);
	
	// check if user has already voted
	PollSchema.findById(req.body.poll_id, function(err, poll) {
		var array = poll.voters;
				
		var obj = array.filter(function ( obj ) {
			return obj.voter.toString() === req.user._id.toString();
		})[0];
		
		// if user hasn't rated already
		if (obj === undefined) {			
			
			// increments vote count
			poll.results[req.body.choice]++;
			
			// adds voter to list of voters
			poll.voters.push({voter: req.user._id, vote: req.body.choice});
			poll.save(function(err) {
				if (err) throw err;
				res.end('Poll updated!');
			});
			
		// if user has rated already
		} else {
			res.end('Already voted!');
		}
		
	});
});

module.exports = router;