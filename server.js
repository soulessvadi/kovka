var express = require('express');
var app = express();
var nodeadmin = require('nodeadmin');

app.use(nodeadmin(app));
app.get('/', function(req, res) {
  res.send("\n" + 'I`m alive, boi!' + "\n\n");
});

app.listen(3000, "192.168.70.20");
console.log('Server running at http://192.168.70.20:3000/');
