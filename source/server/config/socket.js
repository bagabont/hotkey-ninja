var Application = require('../models/application');

module.exports = function (server) {
    var io = require('socket.io')(server);

    // Initialize a new socket.io application
    var game = io.of('/socket').on('connection', function (socket) {

        // When the client emits the 'load' event, reply with the
        // number of players in this game
        socket.on('load', function (data) {
            var clients = findClientsSocket(data, '/socket');
            switch (clients.length) {
                case 0:
                    socket.emit('loaded', {players: 0});
                    break;
                case 1:
                    socket.emit('loaded', {
                        players: 1,
                        user: clients[0].username,
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
            var clients = findClientsSocket(data.id, '/socket');

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
                    clients = findClientsSocket(data.id, '/socket');

                    // if both players are present start the game
                    if (clients.length === 2) {
                        // attach shortcuts list
                        for (var i = 0; i < clients.length; i++) {
                            clients[i].shortcuts = shortcuts;
                            clients[i].progress = 0;
                            clients[i].score = 0;
                        }

                        // Send the start event to all players in the
                        // game, along with a list of players that are in it
                        game.in(data.id).emit('start', {
                            id: data.id,
                            users: users,
                            total: shortcuts.length
                        });

                        // start first query
                        game.in(data.id).emit('query', {
                            query: shortcuts[0].action
                        });
                    }
                });
            }
        });

        // Handle the sending of shortcuts
        socket.on('answer', function (data) {
            // get the room shortcuts
            var shortcuts = this.shortcuts;
            if (!shortcuts) {
                console.log('Undefined shortcuts');
                return;
            }

            var progress = this.progress;
            if (progress < shortcuts.length - 1) {
                // check answer
                var expected = shortcuts[progress].combination;
                var isCorrect = (data.answer === expected);
                if (isCorrect) {
                    socket.score += 1;
                }

                // generate result response and notify
                // all users in the game
                game.in(this.room).emit('progress', {
                    id: data.id,
                    score: socket.score,
                    user: socket.username
                });

                var next = progress + 1;

                // increment progress
                socket.progress = next;

                // send next query
                socket.emit('query', {
                    query: shortcuts[next].action
                });
            }
            else {
                var winner = getWinner(socket.room);
                game.in(socket.room).emit('game over', {
                    winner: winner.username
                });
            }
        });

        // Somebody left the game
        socket.on('disconnect', function () {
            // Notify the other person in the game room
            // that his partner has left
            socket.broadcast.to(socket.room).emit('leave', {
                room: socket.room,
                user: socket.username
            });

            // leave the room
            socket.leave(socket.room);
        });
    });

    function getWinner(roomId) {
        var clients = findClientsSocket(roomId, '/socket');
        var max = 0;
        var winnerIndex = 0;

        //TODO - handle equal score
        for (var i = 0; i < clients.length; i++) {
            if (max < clients[i].score) {
                max = clients[i].score;
                winnerIndex = i;
            }
        }
        return clients[winnerIndex];
    }

    function findClientsSocket(roomId, namespace) {
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

