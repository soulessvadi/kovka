const MySQL = require('mysql');
const db = require('./config');

var mysql = MySQL.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
});

/* db controls */

exports.connection = {
  open: function() {
    mysql.connect(function(err, con) {
      if(err) throw err;
      console.log('connected ', con);
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
