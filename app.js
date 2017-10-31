var // dependencies
express = require('express'),
path = require('path'),
favicon = require('serve-favicon'),
logger = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
//multer = require('multer'),
mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
FacebookStrategy = require('passport-facebook').Strategy;

var // routes
index = require('./routes/index'),
pug = require('./routes/pug'),
profile = require('./routes/profile'),
create = require('./routes/create'),
tournament = require('./routes/tournament'),
league = require('./routes/league'),
team = require('./routes/team'),

rating = require('./routes/rating'),
search = require('./routes/search'),
categories = require('./routes/categories'),
custom_url = require('./routes/custom_url'),
poll = require('./routes/poll'),
messages = require('./routes/messages'),
about = require('./routes/about'),
faq = require('./routes/faq'),
settings = require('./routes/settings');
 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/pug', pug);
app.use('/user', profile);
app.use('/create', create);
app.use('/team', team);
app.use('/tournament', tournament);
app.use('/league', league);

app.use('/rate', rating);
app.use('/search', search);
app.use('/category', categories);
app.use('/url', custom_url);
app.use('/poll', poll);
app.use('/messages', messages);
app.use('/about', about);
app.use('/faq', faq);
app.use('/settings', settings);
app.use('/', index);
app.use('/googleGeo', require('./routes/googleGeo'));

/*
app.post('/upload_image', multer({ dest: './uploads/' }).single('upl'), function(req,res){ 
  console.log(req.body); //form fields
	console.log(req.file); //form files
	res.status(204).end();
});
*/


// passport config
var Account = require('./models/account.js');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// FACEBOOK STRATEGY
passport.use(new FacebookStrategy({
    clientID: '1671267999782363',
    clientSecret: '458f2f50e2ebd25fd453356afdc988d1',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'link', 'email', 'name', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
    Account.findOne({ 'facebook.id': profile.id }, function(err, user) {
      if (err) { 
        return done(err); 
      }
      
      if (!user) {           
        user = new Account({
          username: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          // try to get custom url from facebook
          // try to get profile picture from facebook
          image: profile.photos ? profile.photos[0].value : "/images/profile_default_green.png",
          
          //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
          facebook: profile._json
        });
        user.save(function(err) {
            if (err) console.log(err);
            return done(err, user);
        });
      } else {
        return done(null, user);
      }   
    });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'public_profile', 'user_photos']}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/' }));


// mongoose
mongoose.connect('mongodb://localhost/budgetplanner');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




/*
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'fwragervold@gmail.com',
        pass: 'fwra1136'
    }
});
 
// NB! No need to recreate the transporter object. You can use 
// the same transporter object for all e-mails 
 
// setup e-mail data with unicode symbols 
var mailOptions = {
    from: 'fwra . <frederikwra@gmail.com>', // sender address 
    to: 'fwra@me.com', // list of receivers 
    subject: 'Hello ✔', // Subject line 
    text: 'Hello world ✔', // plaintext body 
    html: '<b>Hello world ✔</b>' // html body 
};
 
// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
 
});
*/


app.listen(3000);

module.exports = app;
