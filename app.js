var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var index = require('./routes/index');
var users = require('./routes/users');


const routes = require('./routes/index');

var app = express();

// Authentication: Passport
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

require('./config/passport')(passport); // pass passport for configuration

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs'); // set up ejs for templating

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication
app.use(session({secret: 'secretkeywhichiwontforget'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//app.use('/', index);
//app.use('/users', users);
require('./routes/index.js')(app, passport);


// application -------------------------------------------------------------
//app.get('*', function(req, res) {
  //  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//});


// listen
app.listen(8080);
console.log("App listening on port 8080");


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

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
