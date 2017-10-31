var express = require('express');
var AccountSchema = require('../models/account');
var router = express.Router();

/* Search events*/
router.get('/', function(req, res) {
	
	res.render('user/settings', { title: req.user.firstName+' | Settings', user: req.user });

});

router.post('/', function(req, res) {

	AccountSchema.findByIdAndUpdate(req.user._id, { 'social.facebook': req.body.facebook, 'social.twitter': req.body.twitter, 'social.instagram': req.body.instagram, 'social.youtube': req.body.youtube }, function(err, result) {
		if (err) throw err;
		
		res.end('Settings updated!');
	});
	
});

module.exports = router;