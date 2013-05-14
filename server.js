var express = require('express');
var async = require('async');

var app = express.createServer();

var io = require('socket.io').listen(app);

var serverIP = '';

async.series([
    function getIPAddres (cb) {
        var interfaces = require('os').networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];

            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && alias.address !== '127.0.1.1' && !alias.internal)
                    serverIP = alias.address;
            }
        }

        cb();
    },
    function startServer (cb) {
        app.configure(function(){
            app.use('/media', express.static(__dirname + '/media'));
        });

        var render = function(res, isControlPanel) {
            res.render('index.jade', {
                layout: false,
                serverIP: serverIP,
                controls: isControlPanel
            });
        };

        app.get('/panel', function(req, res){
            render(res, true);
        });

        app.get('/', function (req, res){
            render(res, false);
        });

        io.sockets.on('connection', function (socket) {
            socket.on('command', function (msg) {
                console.log(msg);
                socket.emit(msg);
                socket.broadcast.emit(msg);
            });
        });

        app.listen(8000);
        console.log('started server', serverIP);
    }
]);

