var // dependencies
express = require('express'),
path = require('path'),
favicon = require('serve-favicon'),

cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
User = require('./models/schemas').user;

// mongoose
mongoose.connect('mongodb://localhost/budgetplanner');
 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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

app.use('/profile', require('./routes/profile'));
app.use('/', require('./routes/index'));

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8888);

module.exports = app;