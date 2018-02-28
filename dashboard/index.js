var randomstring = require('randomstring');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var api = require('./server/api.routes');

module.exports = function dashboard(app, port) {
  fs.readFile(__dirname + '/secret.js', function(err, data) {
    if (err && err.code === 'ENOENT') {
      var randomString = randomstring.generate();
      var contents = "module.exports = '" + randomString + "';";
      fs.writeFileSync(__dirname + '/secret.js', contents);
    }
    var secret = require('./secret.js');
    app.locals.secret = secret;
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));
  app.use('/dashboard', express.static(path.join(__dirname, '/public')));
  app.use('/dashboard/api', api);
  app.get('/dashboard/*', function(req, res) {
      res.sendFile(path.join(__dirname,'public','index.html'));
  });
  return function dashboard(req,res,next) {
    next();
  };
};
