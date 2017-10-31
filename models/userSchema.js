var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    //email: String,
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    categories: { type: Array, default: ["Everyday", "Entertainment", "Utilities", "Home", "Insurance", "Technology", "Transportation", "Travel", "Other", "Debt", "Education"] },
    expenses: { type: Object, default: {
        Entertainment: ["Netflix", "Spotify", "HBO", "Viaplay"],
        Everyday: ["Groceries", "Takeaway", "Alcohol", "Restaurants", "Personal supplies", "Clothes","Laundry/dry cleaning", "Hair/beauty", "Subscriptions", "Other", "Fitness World"],
        Utilities: ["Phone", "Internet", "TV"]
        },
    },
    url: String,
    date: { type: Date, default: Date.now },
    image: { type: String, default: '/images/profile_default_green.png' },
    facebook: { type: Object, default: {} },
    social: { type: Object, default: { facebook: null, instagram: null, youtube: null, twitter: null } }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', User);