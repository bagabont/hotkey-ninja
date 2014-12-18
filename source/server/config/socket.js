var Application = require('../models/application');

module.exports = function (server) {
    var io = require('socket.io')(server);

    // Initialize a new socket.io application
    var game = io.of('/socket').on('connection', function (socket) {

        // When the client emits the 'load' event, reply with the
        // number of players in this game
        socket.on('load', function (data) {
            var room = findClientsSocket(io, data, '/socket');
            switch (room.length) {
                case 0:
                    socket.emit('loaded', {players: 0});
                    break;
                case 1:
                    socket.emit('loaded', {
                        players: 1,
                        user: room[0].username,
                        id: data
                    });
                    break;
                default :
                    game.emit('full');
                    break;
            }
        });

        // When client emits 'join', save his name,
        // and add him to the room
        socket.on('join', function (data) {
            // find game room
            var clients = findClientsSocket(io, data.id, '/socket');

            // Only two people per game are allowed
            if (clients.length >= 2) {
                socket.emit('full');
                return;
            }

            // Use the socket object to store data. Each client gets
            // their own unique socket object
            socket.username = data.user;
            socket.room = data.id;

            // Add the client to the room
            socket.join(data.id);

            if (clients.length == 1) {
                var users = [];
                users.push(clients[0].username);
                users.push(socket.username);

                // get application name
                var appName = data.id.split('/')[0];
                Application.findOne({name: appName}, function (err, model) {
                    if (err) {
                        throw err;
                    }
                    if (!model) {
                        console.log('Application not found.');
                        return;
                    }

                    var shortcuts = model.shortcuts;

                    // get active players client sockets
                    clients = findClientsSocket(io, data.id, '/socket');

                    // if both players are present start the game
                    if (clients.length === 2) {
                        // attach shortcuts list
                        for (var i = 0; i < clients.length; i++) {
                            clients[i].shortcuts = shortcuts;
                        }

                        // Send the start event to all players in the
                        // game, along with a list of players that are in it
                        game.in(data.id).emit('start', {
                            id: data.id,
                            users: users
                        });

                        // start first query
                        game.in(data.id).emit('query', {
                            number: 0,
                            total: shortcuts.length,
                            query: shortcuts[0].action
                        });
                    }

                });
            }
        });

        // Handle the sending of shortcuts
        socket.on('answer', function (data) {
            var shortcutIndex = data.number;
            var combination = data.answer;

            // get the room shortcuts
            var shortcuts = socket.shortcuts;

            if (!shortcuts) {
                console.log('Undefined shortcuts');
                return;
            }
            var expected = shortcuts[shortcutIndex].combination;

            // move to next shortcut query
            shortcutIndex += 1;

            // generate response
            var response = {
                success: false,
                id: data.id,
                user: socket.username
            };
            response['success'] = combination === expected;

            // notify all players for the new progress
            game.in(this.room).emit('progress', response);

            if (shortcutIndex <= shortcuts.length) {
                // ask new question
                socket.emit('query', {
                    number: shortcutIndex,
                    total: shortcuts.length,
                    query: shortcuts[shortcutIndex].action
                });
            }
            else {
                socket.emit('game over');
                console.log('game over for: ' + data.id);
            }
        });

        // Somebody left the game
        socket.on('disconnect', function () {
            // Notify the other person in the game room
            // that his partner has left
            socket.broadcast.to(this.room).emit('leave', {
                room: this.room,
                user: this.username
            });

            // leave the room
            socket.leave(socket.room);
        });
    });

    function findClientsSocket(io, roomId, namespace) {
        var res = [],
            ns = io.of(namespace || "/"); // the default namespace is "/"
        if (ns) {
            for (var id in ns.connected) {
                if (roomId) {
                    var index = ns.connected[id].rooms.indexOf(roomId);
                    if (index !== -1) {
                        res.push(ns.connected[id]);
                    }
                }
                else {
                    res.push(ns.connected[id]);
                }
            }
        }
        return res;
    }
};

