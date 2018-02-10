var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var fs = require('fs');
var path = require('path');
var router = require('./app/routes');

const App = express();

/* templating */
App.engine('html', hbs.__express);
App.set('view engine', 'html');
App.set('view options', { layout: 'app' });
App.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'elements'));
hbs.registerHelper('equals', function(a, b, opts) {
  return (a == b) ? opts.fn(this) : opts.inverse(this);
});
hbs.registerHelper('iseven', function(a, opts) {
  return !(a%2) ? opts.fn(this) : opts.inverse(this);
});
/* templating */

/*
var redis = require('redis'),  client = redis.createClient();
client.set("guest_id", (Math.random() * 100000), redis.print);
client.get("guest_id", function (err, reply) { console.log(reply.toString()); });
*/

/* middlewares group */
App.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(express.static(path.join(__dirname, 'public')));
App.use(cookieParser('megakovka-23-1-18-x808'));
App.use(session({
  secret: 'megakovka-23-1-18-x808',
  name: 'guest',
  resave: true,
  rolling: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 60000000
  }
}));
App.use(logger('dev'));
App.use('/', router);
/* middlewares group */

/* catching 404 */
App.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
/* catching 404 */

/* catching error occurence */
App.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { res: res });
});
/* catching error occurence */

/* App starts  */
App.listen(3000);
