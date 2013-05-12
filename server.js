var express = require('express');


var app = express.createServer();

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    console.log('connected')
});

app.configure(function(){
  app.use('/media', express.static(__dirname + '/media'));
});

app.get('/', function(req, res){
    res.render('index.jade', {layout: false});
});

io.sockets.on('connection', function (socket) {
    socket.on('command', function (msg) { 
        console.log(msg);
    });
});

app.listen(8000);