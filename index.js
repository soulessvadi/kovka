var express = require('express');
var session = require('express-session');
var mysqlsession = require('express-mysql-session')(session);
var db = require('./app/config/mysql');
var mysqlStore = new mysqlsession({ host: db.host, user: db.user, password: db.pass, database: db.name});
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var fs = require('fs');
var path = require('path');
var router = require('./app/routes');
var seeder = require('./app/seeder');
var dashboard = require('./dashboard');
const App = express();
const Secret = 'megakovka-23-1-18-x808';
const port = process.env.PORT || '3000';

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
hbs.registerHelper('foreach', function(a, b, opts) {
  var ret = "";
  for(var i = 0; i < a.length && i < b; i++) ret = ret + opts.fn(a[i]);
  return ret;
});
/* templating */

/* middlewares group */
App.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(express.static(path.join(__dirname, 'public')));
App.use(cookieParser(Secret));
App.use(session({
  secret: Secret,
  name: 'guest',
  store: mysqlStore,
  resave: true,
  rolling: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 86400000 }
}));
App.use(logger('dev'));
App.use(dashboard(App));
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
App.listen(port, () => console.log(`Running on localhost:${port}`));
