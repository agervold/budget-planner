var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leagueSchema = new Schema({
    title: String,
	venue: String,
	street: String,
	number: String,
	city: String,
	country: String,
	lat: Number,
	lng: Number,
	sport: String,
	format: String,
	day: String,
	time: String,
	date: Date,
	priv: Boolean,
	description: String,
	image: String,
	images: { type: Array, default: [] },
	teams: { type: Array, default: [] },
	invited: { type: Array, default: [] },
    size: Number,
	settings: 
	{
		type: Object, default: 
		{
			messages: true,
			notComing: false,				
			invite: true,
			uploadImage: 1,		
			poll: true,
			facebook: null,
			twitter: null
		} 
	},
	user: {
		type: Schema.ObjectId,
		ref: 'Account'
    }
});

module.exports = mongoose.model('league', leagueSchema);