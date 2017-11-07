var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var poll = new Schema({
	question: String,
	choices: { type: Array },
	results: { type: Object },
	voters: { type: Array, default: [] },
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

module.exports = mongoose.model('poll', poll);