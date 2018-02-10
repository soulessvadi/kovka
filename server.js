var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("\n" + 'I`m alive!' + "\n\n");
}).listen(3000, "192.168.70.20");

console.log('Server running at http://192.168.70.20:3000/');
