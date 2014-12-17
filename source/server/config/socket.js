module.exports = function (server) {
    var io = require('socket.io')(server);

    // Initialize a new socket.io application
    var game = io.of('/socket').on('connection', function (socket) {

        // When the client emits the 'load' event, reply with the
        // number of people in this game
        socket.on('load', function (data) {
            var room = findClientsSocket(io, data, '/socket');
            if (room.length === 0) {
                socket.emit('playersInGame', {number: 0});
            }
            else if (room.length === 1) {
                socket.emit('playersInGame', {
                    number: 1,
                    user: room[0].username,
                    id: data
                });
            }
            else if (room.length >= 2) {
                game.emit('tooMany', {boolean: true});
            }
        });

        // When client emits 'join', save his name,
        // and add him to the room
        socket.on('join', function (data) {
            var room = findClientsSocket(io, data.id, '/socket');
            // Only two people per room are allowed
            if (room.length >= 2) {
                socket.emit('tooMany', {boolean: true});
            }
            else {
                // Use the socket object to store data. Each client gets
                // their own unique socket object
                socket.username = data.user;
                socket.room = data.id;

                // Add the client to the room
                socket.join(data.id);

                if (room.length == 1) {
                    var usernames = [];
                    usernames.push(room[0].username);
                    usernames.push(socket.username);

                    // Send the start event to all the people in the
                    // room, along with a list of people that are in it.
                    game.in(data.id).emit('start', {
                        boolean: true,
                        id: data.id,
                        users: usernames
                    });
                }
            }
        });

        // Somebody left the game
        socket.on('disconnect', function () {
            // Notify the other person in the game room
            // that his partner has left
            socket.broadcast.to(this.room).emit('leave', {
                boolean: true,
                room: this.room,
                user: this.username,
                avatar: this.avatar
            });

            // leave the room
            socket.leave(socket.room);
        });

        // Handle the sending of shortcuts
        socket.on('combination', function (data) {
            //TODO - implement
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

