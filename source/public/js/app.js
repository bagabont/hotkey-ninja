(function () {
    var id = 1111111;
    var socket = io();
    console.log(id);
    socket.emit('join', id);
})();