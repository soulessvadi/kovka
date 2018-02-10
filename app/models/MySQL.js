const MySQL = require('mysql');
const db = require('../config/mysql');

var mysql = MySQL.createConnection({
  host: db.host,
  user: db.user,
  password: db.pass,
  database: db.name
});

/* db controls */

exports.connection = {
  open: function() {
    mysql.connect(function(err) {
      if(err) throw err;
    });
  },
  close: function() {
    mysql.end();
  }
};

module.exports.execute = function(query, callback) {
  mysql.query(query, function (err, result, rows) {
    if(err) callback(err, null, null);
    else callback(null, result, rows);
  });
};

module.exports.origin = mysql;

/* db controls */
