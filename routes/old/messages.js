var express = require('express');
var MessageSchema = require('../models/messageSchema');
var router = express.Router();

/* Handles messages. */
router.post('/', function(req, res) {
  var message = req.body.message;
  var event_id = req.body.event_id;
  
  var newMessage = new MessageSchema({
    message: message,
    event: event_id,
    user: req.user._id	
  });
  
  newMessage.save(function(err) {
	  if (err) throw err;
	  console.log('Message saved!');
	  res.end('Message saved!');
  });
});

module.exports = router;