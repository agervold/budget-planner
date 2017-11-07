var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

/*
var year = {
    jan: {
        total: 0,
        entries: []
    }, feb: {
        total: 0,
        entries: []
    }, mar: {
        total: 0,
        entries: []
    }, apr: {
        total: 0,
        entries: []
    }, may: {
        total: 0,
        entries: []
    }, jun: {
        total: 0,
        entries: []
    }, jul: {
        total: 0,
        entries: []
    }, aug: {
        total: 0,
        entries: []
    }, sep: {
        total: 0,
        entries: []
    }, oct: {
        total: 0,
        entries: []
    }, nov: {
        total: 0,
        entries: []
    }, dec: {
        total: 0,
        entries: []
    }
};
var income = [
    ["paycheck", "tips", "bonus", "commision", "other"],
    ["transfer from savings", "interest income", "dividends", "gifts", "refunds", "other"]
]
var incomeObj = {
    "wages": {},
    "other": {}
}
for (var c = 0; c < income.length; c++) {
    var cat = income[c];
    for (var e = 0; e < cat.length; e++) {
        incomeObj[Object.keys(incomeObj)[c]][cat[e]] = {2017: year};
    }
}
var expenses = [
    ["Groceries", "Takeaway", "Alcohol", "Restaurants", "Personal supplies", "Clothes", "Laundry/dry cleaning", "Hair/beauty", "Subscriptions", "Other", "Fitness World"],
    ["Netflix", "Spotify", "HBO", "Viaplay"],
    ["Phone", "Internet", "TV"]
]
var expensesObj = {
    "everyday": {},
    "entertainment": {},
    "utilities": {}
}
for (var c = 0; c < expenses.length; c++) {
    var cat = expenses[c];
    for (var e = 0; e < cat.length; e++) {
        expensesObj[Object.keys(expensesObj)[c]][cat[e]] = {2017: year};
    }
}
*/
var User = new Schema({
    username: String,
    incomeCategories: { type: Array, default: [] },
    expensesCategories: { type: Array, default: [] },
    //password: String,
    /*
    categories: { type: Array, default: ["Everyday", "Entertainment", "Utilities", "Home", "Insurance", "Technology", "Transportation", "Travel", "Other", "Debt", "Education"] },
    expenses: { type: Object, default: {
        Entertainment: ["Netflix", "Spotify", "HBO", "Viaplay"],
        Everyday: ["Groceries", "Takeaway", "Alcohol", "Restaurants", "Personal supplies", "Clothes","Laundry/dry cleaning", "Hair/beauty", "Subscriptions", "Other", "Fitness World"],
        Utilities: ["Phone", "Internet", "TV"]
        },
    },
    */
    //income: { type: Object, default: incomeObj },
    //expenses: { type: Object, default: expensesObj },
    date: { type: Date, default: Date.now }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);