var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');


var indexRouter     = require('./routes/index');
var usersRouter     = require('./routes/users');
var startupRouter   = require('./routes/catalog');
var authRouter      = require('./routes/auth');
var {MongoDB, session}       = require('./config/keys');
var passportSetup   = require('./config/passport');


var app = express();

//Set up mongoose connection
var mongoose = require('mongoose')
var mongoDB = MongoDB.dbURI
mongoose.connect(mongoDB, {useNewURLParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [session.cookieKey]
}));


//initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', startupRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
