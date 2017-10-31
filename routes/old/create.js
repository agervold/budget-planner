var express = require('express');
var eventSchema = require('../models/pugSchema');
var teamSchema = require('../models/teamSchema');
var router = express.Router();
var https = require('https');
var mongoose = require("mongoose");

/* GET create page. */
router.get('/', function(req, res, next) {
  res.render('create/createPug', { title: 'PUG | Create Pick Up Game', user: req.user });
});

router.get('/tournament', function(req, res) {
    res.render('create/createTournament', { title: 'PUG | Create Tournament', user: req.user });
});

router.get('/league', function(req, res) {
    res.render('create/createLeague', { title: 'PUG | Create League', user: req.user });
});

router.get('/team', function(req, res) {
    res.render('create/createTeam', { title: 'PUG | Create Team', user: req.user });
});

router.post('/', function(req, res) {

    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+req.body.street+"+"+req.body.number+","+req.body.city+","+req.body.country+"&key=AIzaSyBgGEK8zJNXy_Ye-x0sDwFXr6336f66zOE";
    var request = https.get(url, function(response) {
        var body = "";
        response.on("data", function(chunk) {
            body += chunk;
        });

        response.on("end", function() {
            var obj = JSON.parse(body);
            var lat = obj["results"][0]["geometry"]["location"]["lat"];
            var lng = obj["results"][0]["geometry"]["location"]["lng"];

            var newEvent = eventSchema({
              title: req.body.title,
              venue: req.body.venue,
              street: req.body.street,
              number: req.body.number,
              city: req.body.city,
              country: req.body.country,
              lat: lat,
              lng: lng,
              sport: req.body.sport,
              category: req.body.category,
              subcategory: req.body.subcategory,
              day: req.body.date,
              time: req.body.time,
              date: Date.parse(req.body.date + ' ' + req.body.time),
              priv: req.body.private || false,
              description: req.body.info,
              image: '/images/concert.jpg',
              attending: [req.user._id],
              user: req.user.id
            });

            console.log(newEvent);
            
            newEvent.save(function(err){
              if (err) throw err;
              
              console.log('event saved');
            });
            
            res.redirect('/pug/'+newEvent._id);
        });
    });
  
});


router.post('/team', function(req, res) {

    teamSchema.findOne({name: req.body.name}, function(err, team) {
        if (team !== null) {
            res.end("Name already taken");
        } else {
            var newTeam = teamSchema({
                name: req.body.name,
                city: req.body.city,
                country: req.body.country,
                sport: req.body.sport,
                players: [req.user.id],
                user: req.user.id
            });

            console.log(newTeam);
            
            newTeam.save(function(err){
                if (err) {
                    res.end("error");    
                }
                
                console.log('team saved');
                res.end('/team/'+newTeam._id);
            });
        }
    });
});

var cities = 
[
    "Frederiksberg", 
    "Paris",
    "London",
    "Berlin",
    "Oslo",
    "Stockholm", 
    "Madrid",
    "Rome",
    "Vienna",
    "Roskilde"
]
var countries =
[
    "Denmark",
    "France",
    "England",
    "Germany",
    "Norway",
    "Sweden",
    "Spain",
    "Italy",
    "Austria",
    "Denmark"
]

function createFakePug(index) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+cities[index]+","+countries[index]+"&key=AIzaSyBgGEK8zJNXy_Ye-x0sDwFXr6336f66zOE";
    var request = https.get(url, function(response) {
        var body = "";
        response.on("data", function(chunk) {
            body += chunk;
        });

        response.on("end", function() {
            var obj = JSON.parse(body);
            var lat = obj["results"][0]["geometry"]["location"]["lat"];
            var lng = obj["results"][0]["geometry"]["location"]["lng"];

            var newEvent = eventSchema({
                title: "Bold i "+cities[index],
                street: cities[index]+" Street",
                number: 1,
                city: cities[index],
                country: countries[index],
                lat: lat,
                lng: lng,
                sport: "Football",
                day: "2015-12-24",
                time: index+":30",
                date: Date.parse("2015-12-24" + ' ' + index+":30"),
                priv: false,
                description: "Football PUG at "+cities[index]+", "+countries[index],
                image: '/images/concert.jpg',
                attending: [new mongoose.mongo.ObjectID("5767f69ac1cf76c046aaae8b")],
                user: new mongoose.mongo.ObjectID("5767f69ac1cf76c046aaae8b")
            });
            
            newEvent.save(function(err){
              if (err) throw err;
              
              console.log('event saved');
            });
        });
    });
}

/*
for (var i = 1; i < cities.length; i++) {
    createFakePug(i);
}
*/

module.exports = router;
