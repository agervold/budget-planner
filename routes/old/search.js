var express = require('express');
var eventSchema = require('../models/pugSchema');
var router = express.Router();

/* Search events*/
router.get('/', function(req, res) {
	
	var event = req.query.event;

	eventSchema.find({ title: {$regex: event, $options: 'i'} }, function(err, events) {
		if(err) return err;
		if(events) {
			res.render('search', {title: 'event | '+event, user: req.user, events: events});
		} else {
			res.end('Not found.');
		}
	});

});

module.exports = router;