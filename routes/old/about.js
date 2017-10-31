var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('extra/about');
});

module.exports = router;