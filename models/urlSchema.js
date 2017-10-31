var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var custom_url = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'Account'
    },
	url: String
});

module.exports = mongoose.model('custom_url', custom_url);