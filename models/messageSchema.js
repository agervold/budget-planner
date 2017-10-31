var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var message = new Schema({
	message: String,
	date: { type: Date, default: Date.now },
	event: 
	{
		type: Schema.ObjectId,
		ref: 'Events'
    },
	user: 
	{
		type: Schema.ObjectId,
		ref: 'Account'
    }
});

module.exports = mongoose.model('Message', message);