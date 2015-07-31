var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var course = require('./routes/course');
var api = require('./routes/api/index');
var session = require('express-session');


//--NGN-BEGIN require
var i18n = require('i18n-2');
var partials = require('./routes/partials');
var api = require('./routes/api/index');

//--NGN-END require

//--NGN-BEGIN modelrequire
var course = require('./routes/course');

//--NGN-END modelrequire
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine','ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//--NGN-BEGIN i18n-2
i18n.expressBind(app, {
    // setup some locales - other locales default to vi silently
    locales: ['en', 'zh'],
    // set the default locale
    defaultLocale: 'en',
    // set the cookie name
    cookieName: 'locale'});
// set up the middleware
app.use(function(req, res, next) {
    //req.i18n.setLocaleFromQuery();
    req.i18n.setLocale(req.i18n.preferredLocale(req));
    next();
});

//--NGN-END i18n-2

app.use(session({secret: 'thredu',resave: true,
    saveUninitialized: true}));

app.use('/', routes);
app.use('/users', users);
app.use('/api',api);
app.use('/course',course);


//--NGN-BEGIN use
app.use('/partials',partials);
app.use('/api',api);

//--NGN-END use

//--NGN-BEGIN modeluse
app.use('/course',course);

//--NGN-END modeluse
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


module.exports = app;
