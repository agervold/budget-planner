var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    name: String,
    city: String,
    country: String,
    sport: String,
	players: { type: Array, default: [] },
    tournaments: { type: Array, default: [] },
    leagues: { type: Array, default: [] },
	user: {
		type: Schema.ObjectId,
		ref: 'Account'
    }
});

module.exports = mongoose.model('team', teamSchema);