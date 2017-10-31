var express = require('express');
var eventSchema = require('../models/pugSchema');
var router = express.Router();
var https = require('https');

/* GET create page. */
router.get('/', function(req, res, next) {
  res.render('pug/googleGeo');
});

//res.render('pug/googleGeo');
/*
var url = "https://maps.googleapis.com/maps/api/geocode/json?address=Lollandsvej+36,Frederiksberg,Denmark&key=AIzaSyBgGEK8zJNXy_Ye-x0sDwFXr6336f66zOE";
var request = https.get(url, function(response) {
    
    console.log(response.statusCode);
    var body = "";
    response.on("data", function(chunk) {
        body += chunk;
    });

    response.on("end", function() {
        console.log(body);
        var obj = JSON.parse(body);
        var lat = obj["results"][0]["geometry"]["location"]["lat"];
        var lng = obj["results"][0]["geometry"]["location"]["lng"];
        console.log(`lat: ${lat}, lng: ${lng}`);
    });
});
*/

router.post('/', function(req, res) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+req.body.street+"+"+req.body.number+","+req.body.city+","+req.body.country+"&key=AIzaSyBgGEK8zJNXy_Ye-x0sDwFXr6336f66zOE";
    var request = https.get(url, function(response) {
        
        console.log(response.statusCode);
        var body = "";
        response.on("data", function(chunk) {
            body += chunk;
        });

        response.on("end", function() {
            console.log(body);
            var obj = JSON.parse(body);
            var lat = obj["results"][0]["geometry"]["location"]["lat"];
            var lng = obj["results"][0]["geometry"]["location"]["lng"];
            console.log(`lat: ${lat}, lng: ${lng}`);
            res.end(`lat: ${lat}, lng: ${lng}`);
        });
    });
});

/*
router.post('/', function(req, res) {
  
    var options = {
        hostname: "maps.googleapis.com",
        path: "/maps/api/geocode/json?address="+req.body.street+"+"+req.body.number+","+req.body.city+","+req.body.country+"&key=AIzaSyBgGEK8zJNXy_Ye-x0sDwFXr6336f66zOE",
        method: "GET"
    }

    var body = [];

    var req = https.request(options, (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', (d) => {
            body.push(d);
            process.stdout.write(d);
        });
    });
    req.end(function() {
        body = Buffer.concat(body).toString();
    });

    req.on('error', (e) => {
        console.error(e);
    });
});
*/
module.exports = router;
